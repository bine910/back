import { z } from "zod";
import { fetchFileContent, getTreeEntries } from "../github.js";

const DEFAULT_REF = "main";
/** Unauthenticated: stay gentle; with GITHUB_PERSONAL_ACCESS_TOKEN you can lower this */
const DELAY_MS = Number(process.env.MCP_GITHUB_DELAY_MS) || 150;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function jsonResult(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

function toolError(message) {
  return {
    content: [{ type: "text", text: JSON.stringify({ error: message }) }],
    isError: true,
  };
}

/**
 * @param {string} line
 * @returns {"TODO" | "FIXME" | null}
 */
function lineMarkType(line) {
  const t = line.trim();
  if (/\/\/\s*TODO\b/i.test(t) || /\/\*\s*TODO\b/i.test(t)) {
    return "TODO";
  }
  if (/\/\/\s*FIXME\b/i.test(t) || /\/\*\s*FIXME\b/i.test(t)) {
    return "FIXME";
  }
  return null;
}

/** @param {import("@modelcontextprotocol/sdk/server/mcp.js").McpServer} server */
export function registerQualityTools(server) {
  server.registerTool(
    "get_todo_comments",
    {
      title: "Scan src for TODO/FIXME",
      description:
        "All // TODO and // FIXME in src/**/*.js|jsx (many API calls; set GITHUB_PERSONAL_ACCESS_TOKEN to raise rate limit)",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        const tree = await getTreeEntries(DEFAULT_REF);
        const files = tree
          .filter((e) => e.type === "blob" && e.path)
          .map((e) => e.path)
          .filter(
            (p) =>
              p.startsWith("src/") && (p.endsWith(".js") || p.endsWith(".jsx")),
          );
        const matches = [];
        /** @type {{ file: string; error: string }[]} */
        const fetchFailures = [];
        for (let i = 0; i < files.length; i += 1) {
          if (i > 0) {
            await sleep(DELAY_MS);
          }
          const file = files[i];
          let text;
          try {
            text = await fetchFileContent(file);
          } catch (e) {
            fetchFailures.push({
              file,
              error: e instanceof Error ? e.message : String(e),
            });
            continue;
          }
          const lines = text.split(/\r?\n/);
          lines.forEach((line, idx) => {
            const kind = lineMarkType(line);
            if (kind) {
              matches.push({
                file,
                line: idx + 1,
                type: kind,
                text: line.trim(),
              });
            }
          });
        }
        return jsonResult({ matches, fetchFailures });
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );
}

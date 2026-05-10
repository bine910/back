import { z } from "zod";
import { fetchFileContent, getTreeEntries } from "../github.js";

const DEFAULT_REF = "main";

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
 * @param {string} code
 * @returns {"class" | "functional" | "arrow functional" | "hook" | "unknown"}
 */
function detectType(code) {
  if (/\bclass\s+[\w$]+\s+extends\s+(?:React\.)?(?:Component|PureComponent)\b/.test(code)) {
    return "class";
  }
  if (/\bfunction\s+use[A-Z][\w$]*\s*\(/.test(code) || /\bconst\s+use[A-Z][\w$]*\s*=\s*/.test(code)) {
    return "hook";
  }
  if (/\bfunction\s+[A-Z][\w$]*\s*\(/.test(code)) {
    return "functional";
  }
  if (/\bconst\s+[A-Z][\w$]*\s*=\s*(?:\([^)]*\)\s*=>|(?:\{\s*)?\()/.test(code)) {
    return "arrow functional";
  }
  return "unknown";
}

/**
 * Best-effort destructured prop names from component signature
 * @param {string} code
 * @returns {string[]}
 */
function extractDestructuredProps(code) {
  const patterns = [
    /export\s+default\s+function\s+[\w$]+\s*\(\s*\{([^}]*)\}\s*\)/,
    /export\s+function\s+[A-Z][\w$]*\s*\(\s*\{([^}]*)\}\s*\)/,
    /function\s+[A-Z][\w$]*\s*\(\s*\{([^}]*)\}\s*\)/,
    /function\s+[A-Z][\w$]*\s*\(\s*\{([^}]*)\}\s*,/,
    /const\s+[A-Z][\w$]*\s*=\s*\(\s*\{([^}]*)\}\s*\)/,
    /const\s+[A-Z][\w$]*\s*=\s*\(\s*\{([^}]*)\}\s*\)\s*=>/,
  ];
  for (const re of patterns) {
    const m = code.match(re);
    if (m?.[1]) {
      return parsePropsSegment(m[1]);
    }
  }
  return [];
}

/**
 * @param {string} inner - inside `{ ... }`
 */
function parsePropsSegment(inner) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of inner) {
    if (ch === "{" || ch === "(") {
      depth += 1;
    }
    if (ch === "}" || ch === ")") {
      depth = Math.max(0, depth - 1);
    }
    if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) {
    parts.push(cur.trim());
  }
  return parts
    .map((p) => {
      const t = p.split("=")[0].split(":")[0].replace(/\s*as\s+.*$/, "").trim();
      if (t.startsWith("...")) {
        return t.replace(/^\.\.\./, "...");
      }
      return t;
    })
    .filter((t) => t && !t.startsWith("//") && !t.startsWith("/*"));
}

/** @param {import("@modelcontextprotocol/sdk/server/mcp.js").McpServer} server */
export function registerComponentTools(server) {
  server.registerTool(
    "get_component_list",
    {
      title: "List React component files",
      description:
        "List .js/.jsx files under src/components/ and src/pages/ (main tree)",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        const tree = await getTreeEntries(DEFAULT_REF);
        const out = tree
          .filter((e) => e.type === "blob" && e.path)
          .map((e) => e.path)
          .filter(
            (p) =>
              (p.startsWith("src/components/") || p.startsWith("src/pages/")) &&
              (p.endsWith(".js") || p.endsWith(".jsx")),
          );
        return jsonResult([...new Set(out)].sort());
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    "get_component_code",
    {
      title: "Get component source",
      description: "Fetch and return file contents (base64-decoded) for a path in the repo",
      inputSchema: z.object({
        path: z.string().min(1).describe('e.g. "src/components/Button.jsx"'),
      }),
    },
    async ({ path }) => {
      try {
        const code = await fetchFileContent(path);
        return jsonResult({ path, code });
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    "detect_component_type",
    {
      title: "Detect component type",
      description: "Class / functional / arrow / hook / unknown heuristics from file content",
      inputSchema: z.object({
        path: z.string().min(1),
      }),
    },
    async ({ path }) => {
      try {
        const code = await fetchFileContent(path);
        const type = detectType(code);
        return jsonResult({ path, type });
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    "get_component_props",
    {
      title: "Extract destructured props",
      description: "Props from function({ ... }) or const X = ({ ... }) => (best-effort)",
      inputSchema: z.object({
        path: z.string().min(1),
      }),
    },
    async ({ path }) => {
      try {
        const code = await fetchFileContent(path);
        const props = extractDestructuredProps(code);
        return jsonResult({ path, props });
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );
}

import { z } from "zod";
import { githubGet } from "../github.js";

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

/** @param {import("@modelcontextprotocol/sdk/server/mcp.js").McpServer} server */
export function registerGitTools(server) {
  server.registerTool(
    "get_branches",
    {
      title: "List branches",
      description: "List all branch names in dangle10/react",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        /** @type {{ name: string }[]} */
        const branches = await githubGet("/branches");
        return jsonResult(branches.map((b) => b.name));
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    "get_commit_history",
    {
      title: "Commit history",
      description: "Recent commits on a branch (default main)",
      inputSchema: z.object({
        branch: z.string().optional().default("main"),
        limit: z.number().int().min(1).max(100).optional().default(10),
      }),
    },
    async ({ branch, limit }) => {
      try {
        const q = new URLSearchParams({ sha: branch, per_page: String(limit) });
        /** @type {{ sha: string; commit: { message: string; author: { name: string; date: string } } }[]} */
        const commits = await githubGet(`/commits?${q.toString()}`);
        const out = commits.map((c) => ({
          sha: c.sha,
          message: c.commit.message.split("\n")[0],
          author: c.commit.author?.name ?? "",
          date: c.commit.author?.date ?? "",
        }));
        return jsonResult(out);
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    "get_diff",
    {
      title: "Compare branches or commits",
      description: "Diff two refs (branches or SHAs) via compare API",
      inputSchema: z.object({
        base: z.string().min(1).describe("Base branch or commit"),
        head: z.string().min(1).describe("Head branch or commit"),
      }),
    },
    async ({ base, head }) => {
      try {
        const seg = `${encodeURIComponent(base)}...${encodeURIComponent(head)}`;
        const data = await githubGet(`/compare/${seg}`);
        const rawFiles = data.files ?? [];
        const files = rawFiles.map(
          /** @param {{ filename: string; status: string; additions?: number; deletions?: number }} f */
          (f) => ({
            path: f.filename,
            status: f.status,
            additions: f.additions ?? 0,
            deletions: f.deletions ?? 0,
          }),
        );
        return jsonResult({
          status: data.status,
          ahead_by: data.ahead_by,
          behind_by: data.behind_by,
          total_commits: data.total_commits,
          files,
          total_additions: rawFiles.reduce((a, f) => a + (f.additions ?? 0), 0),
          total_deletions: rawFiles.reduce((a, f) => a + (f.deletions ?? 0), 0),
        });
      } catch (e) {
        return toolError(e instanceof Error ? e.message : String(e));
      }
    },
  );
}

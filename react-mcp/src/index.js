import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGitTools } from "./tools/git.js";
import { registerComponentTools } from "./tools/components.js";
import { registerQualityTools } from "./tools/quality.js";

const server = new McpServer(
  {
    name: "react-mcp",
    version: "1.0.0",
  },
  {
    instructions:
      "Read-only tools for the public repo dangle10/react via GitHub API (src/components, src/pages, git history). Unauthenticated rate limit is low; set GITHUB_PERSONAL_ACCESS_TOKEN for heavier scans (e.g. get_todo_comments).",
  },
);

registerGitTools(server);
registerComponentTools(server);
registerQualityTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);

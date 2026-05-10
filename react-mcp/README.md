# react-mcp

MCP server (Node.js) exposing **read-only** tools for the public repo [**dangle10/react**](https://github.com/dangle10/react). Data comes only from the **GitHub REST API** (no clone, no `fs` git).

Stack used here: `@modelcontextprotocol/sdk`, `zod`, Node built-in `fetch`.

## Install

```bash
cd react-mcp
npm install
```

## Environment

| Variable | Purpose |
|----------|---------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Optional. Unauthenticated limit is **60 requests/hour** per IP; with a classic PAT you get **5 000/hour**. Recommended for `get_todo_comments` (many file fetches). |
| `MCP_GITHUB_DELAY_MS` | Optional. Delay between file requests in `get_todo_comments` (default `150`). |

## Tools

### Git (`tools/git.js`)

- **`get_branches`** — `GET .../branches` → branch names.
- **`get_commit_history`** — `branch` (default `main`), `limit` (default `10`) → `{ sha, message, author, date }`.
- **`get_diff`** — `base`, `head` → compare summary + per-file additions/deletions.

### Components (`tools/components.js`)

- **`get_component_list`** — `.js` / `.jsx` under `src/components/` and `src/pages/` (tree on `main`).
- **`get_component_code`** — `path` → `{ path, code }`.
- **`detect_component_type`** — `path` → `{ path, type }` where `type` is `class` \| `functional` \| `arrow functional` \| `hook` \| `unknown`.
- **`get_component_props`** — `path` → `{ path, props }` from destructuring in the signature (best effort).

### Quality (`tools/quality.js`)

- **`get_todo_comments`** — Scans `src/**/*.js` and `src/**/*.jsx` for `// TODO` and `// FIXME`. Returns `{ matches: [...], fetchFailures: [...] }` so failed downloads do not look like code comments.

## Run (stdio)

```bash
npm start
```

## Test with MCP Inspector

```bash
npm run inspect
```

## Cursor

Add a server entry (user-level `~/.cursor/mcp.json` or project `.cursor/mcp.json` / `.vscode/mcp.json` depending on your setup), using an **absolute** path to this repo:

```json
{
  "mcpServers": {
    "react-mcp": {
      "command": "node",
      "args": ["C:/Code/hoc3/react-mcp/src/index.js"]
    }
  }
}
```

To use a token (optional), add:

```json
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
}
```

## Scope (intentional)

- No ESLint, no Vite build, no writes to GitHub — read-only inspection only.

const BASE = "https://api.github.com/repos/dangle10/react";

/**
 * @returns {Record<string, string>}
 */
export function getGithubHeaders() {//tạo HTTP headers cho mọi request gửi lên GitHub
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token =
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * @param {string} path - path after BASE (e.g. `/branches` or `?ref=main`)
 */
export async function githubGet(path) {
  const res = await fetch(`${BASE}${path}`, { headers: getGithubHeaders() });
  if (!res.ok) {
    const body = await res.text();
    let detail = body;
    try {
      const j = JSON.parse(body);
      detail = j.message ?? body;
    } catch {
      /* ignore */
    }
    throw new Error(`GitHub API error: ${res.status} ${detail}`);
  }
  return res.json();
}

export function decodeBase64(encoded) {//Giải mã chuỗi base64 thành chuỗi UTF-8
  return Buffer.from(encoded.replace(/\n/g, ""), "base64").toString("utf8");
}

/**
 * @param {string} ref - branch, tag, or commit (e.g. main)
 * @returns {Promise<{ path: string; type: string; mode?: string; sha: string; size?: number; url: string }[]>}
 */
export async function getTreeEntries(ref) {
  const data = await githubGet(`/git/trees/${encodeURIComponent(ref)}?recursive=1`);
  if (!data.tree) {
    return [];
  }
  return data.tree;
}

/**
 * @param {string} path - repo-relative path
 * @returns {Promise<string>} file text
 */
export async function fetchFileContent(path) {
  const urlPath = path
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  const res = await fetch(`${BASE}/contents/${urlPath}`, { headers: getGithubHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub contents ${path}: ${res.status} ${body}`);
  }
  /** @type {{ encoding: string; content?: string; download_url?: string | null }} */
  const data = await res.json();
  if (data.encoding === "base64" && data.content) {
    return decodeBase64(data.content);
  }
  if (data.download_url) {
    const r = await fetch(data.download_url, { headers: getGithubHeaders() });
    if (!r.ok) {
      throw new Error(`Download ${path}: ${r.status}`);
    }
    return r.text();
  }
  throw new Error(`Could not decode contents for ${path}`);
}

export { BASE };

import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryVolume } from "../memory-volume";
import { NodepodShell } from "../shell/shell-interpreter";
import { createGitCommand } from "../shell/commands/git";

function createGitShell(files?: Record<string, string>, cwd = "/project") {
  const vol = new MemoryVolume();
  if (files) {
    for (const [filePath, content] of Object.entries(files)) {
      const dir = filePath.substring(0, filePath.lastIndexOf("/")) || "/";
      if (dir !== "/") vol.mkdirSync(dir, { recursive: true });
      vol.writeFileSync(filePath, content);
    }
  }

  const shell = new NodepodShell(vol, {
    cwd,
    env: {
      HOME: "/home/user",
      PATH: "/usr/bin",
      PWD: cwd,
      GITHUB_TOKEN: "test-token",
    },
  });
  shell.registerCommand(createGitCommand());
  return { vol, shell };
}

const REPO = "acme/demo";
const API = `https://api.github.com/repos/${REPO}`;

describe("git command", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function initRepo(shell: NodepodShell) {
    expect((await shell.exec("git init")).exitCode).toBe(0);
    expect((await shell.exec("git config user.email test@example.com")).exitCode).toBe(0);
    expect((await shell.exec("git config user.name Tester")).exitCode).toBe(0);
    expect((await shell.exec(`git config remote.origin.url https://github.com/${REPO}.git`)).exitCode).toBe(0);
    expect((await shell.exec("git add file.txt")).exitCode).toBe(0);
    expect((await shell.exec("git commit -m \"Initial commit\"")).exitCode).toBe(0);
  }

  function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  function pushRoutes(url: string, method: string): Response | undefined {
    if (url.endsWith("/git/blobs") && method === "POST") {
      return jsonResponse({ sha: "blob-sha" }, 201);
    }
    if (url.endsWith("/git/trees") && method === "POST") {
      return jsonResponse({ sha: "push-tree-sha" }, 201);
    }
    if (url.endsWith("/git/commits") && method === "POST") {
      return jsonResponse({ sha: "push-commit-sha" }, 201);
    }
    if (url.endsWith("/git/refs/heads/main") && method === "PATCH") {
      return jsonResponse({ ref: "refs/heads/main" });
    }
    return undefined;
  }

  function setupAndStub(handler: (url: string, method: string) => Response | undefined) {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      const result = handler(url, method);
      if (result) return result;
      throw new Error(`Unexpected fetch: ${method} ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const { shell } = createGitShell({ "/project/file.txt": "hello from nodepod\n" });
    return { shell, fetchMock };
  }

  it("bootstraps an empty remote before the first push", async () => {
    let refCallCount = 0;

    const { shell, fetchMock } = setupAndStub((url, method) => {
      if (url.endsWith("/git/ref/heads/main") && method === "GET") {
        refCallCount++;
        if (refCallCount === 1) {
          return jsonResponse({ message: "Not Found" }, 404);
        }
        return jsonResponse({ object: { sha: "remote-head-sha" } });
      }
      if (url.endsWith(`/repos/${REPO}`) && method === "GET") {
        return jsonResponse({ default_branch: "main" });
      }
      if (url.endsWith("/contents/.gitkeep") && method === "PUT") {
        return jsonResponse({ content: { path: ".gitkeep" } }, 201);
      }
      return pushRoutes(url, method);
    });
    await initRepo(shell);

    const pushResult = await shell.exec("git push origin main");

    expect(pushResult.exitCode).toBe(0);
    expect(pushResult.stderr).toBe("");
    expect(pushResult.stdout).toContain("main -> main");

    expect(fetchMock).toHaveBeenCalledWith(
      `${API}/git/ref/heads/main`,
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${API}/contents/.gitkeep`,
      expect.objectContaining({ method: "PUT" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${API}`,
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("pushes directly when the remote branch already exists", async () => {
    const { shell, fetchMock } = setupAndStub((url, method) => {
      if (url.endsWith("/git/ref/heads/main") && method === "GET") {
        return jsonResponse({ object: { sha: "existing-sha" } });
      }
      return pushRoutes(url, method);
    });
    await initRepo(shell);

    const pushResult = await shell.exec("git push origin main");

    expect(pushResult.exitCode).toBe(0);
    expect(pushResult.stdout).toContain("main -> main");

    expect(fetchMock).not.toHaveBeenCalledWith(
      `${API}/contents/.gitkeep`,
      expect.anything(),
    );
    expect(fetchMock).not.toHaveBeenCalledWith(
      `${API}`,
      expect.objectContaining({ method: "GET" }),
    );
  });
});

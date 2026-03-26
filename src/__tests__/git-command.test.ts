import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

describe("git command", () => {
  beforeEach(() => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url.endsWith("/git/ref/heads/main") && method === "GET") {
        if (fetchMock.mock.calls.filter(([calledInput, calledInit]) => String(calledInput).endsWith("/git/ref/heads/main") && (calledInit?.method ?? "GET") === "GET").length === 1) {
          return new Response(JSON.stringify({ message: "Not Found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ object: { sha: "remote-head-sha" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/repos/acme/demo") && method === "GET") {
        return new Response(JSON.stringify({ default_branch: "main" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/contents/.gitkeep") && method === "PUT") {
        return new Response(JSON.stringify({ content: { path: ".gitkeep" } }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/git/trees") && method === "POST") {
        const body = JSON.parse(String(init?.body ?? "{}"));
        const sha = "push-tree-sha";
        return new Response(JSON.stringify({ sha }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/git/commits") && method === "POST") {
        const body = JSON.parse(String(init?.body ?? "{}"));
        const sha = body.message === "Initialize main" ? "initial-commit-sha" : "push-commit-sha";
        return new Response(JSON.stringify({ sha }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/git/refs") && method === "POST") {
        return new Response(JSON.stringify({ ref: "refs/heads/main" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/git/blobs") && method === "POST") {
        return new Response(JSON.stringify({ sha: "blob-sha" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/git/refs/heads/main") && method === "PATCH") {
        return new Response(JSON.stringify({ ref: "refs/heads/main" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      throw new Error(`Unexpected fetch: ${method} ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("bootstraps an empty remote before the first push", async () => {
    const { shell } = createGitShell({
      "/project/file.txt": "hello from nodepod\n",
    });

    expect((await shell.exec("git init")).exitCode).toBe(0);
    expect((await shell.exec("git config user.email test@example.com")).exitCode).toBe(0);
    expect((await shell.exec("git config user.name Tester")).exitCode).toBe(0);
    expect((await shell.exec("git config remote.origin.url https://github.com/acme/demo.git")).exitCode).toBe(0);
    expect((await shell.exec("git add file.txt")).exitCode).toBe(0);
    expect((await shell.exec("git commit -m \"Initial commit\"")).exitCode).toBe(0);

    const pushResult = await shell.exec("git push origin main");

    expect(pushResult.exitCode).toBe(0);
    expect(pushResult.stderr).toBe("");
    expect(pushResult.stdout).toContain("main -> main");

    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/acme/demo/git/ref/heads/main",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/acme/demo/contents/.gitkeep",
      expect.objectContaining({ method: "PUT" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/repos/acme/demo",
      expect.objectContaining({ method: "GET" }),
    );
  });
});

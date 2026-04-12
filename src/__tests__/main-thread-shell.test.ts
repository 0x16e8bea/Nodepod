import { describe, it, expect, beforeEach } from "vitest";
import { MemoryVolume } from "../memory-volume";
import { NodepodShell } from "../shell/shell-interpreter";
import type { ShellResult, ShellCommand } from "../shell/shell-types";

describe("Main-thread shell (NodepodShell on main thread)", () => {
  let volume: MemoryVolume;
  let shell: NodepodShell;

  beforeEach(() => {
    volume = new MemoryVolume();
    volume.mkdirSync("/project", { recursive: true });
    volume.writeFileSync("/project/hello.txt", "Hello, world!");
    shell = new NodepodShell(volume, { cwd: "/project" });
  });

  it("runs builtins directly against the volume", async () => {
    const result = await shell.exec("cat hello.txt");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello, world!");
  });

  it("supports pipes between builtins", async () => {
    volume.writeFileSync(
      "/project/data.txt",
      "apple\nbanana\ncherry\napricot\n",
    );
    const result = await shell.exec("cat data.txt | grep ap");
    expect(result.exitCode).toBe(0);
    // grep may add ANSI color codes, so strip them for matching
    const plain = result.stdout.replace(/\x1b\[[0-9;]*m/g, "");
    expect(plain).toContain("apple");
    expect(plain).toContain("apricot");
    expect(plain).not.toContain("banana");
  });

  it("supports && chains", async () => {
    const result = await shell.exec("echo first && echo second");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("first");
    expect(result.stdout).toContain("second");
  });

  it("stops && chain on failure", async () => {
    const result = await shell.exec("cat nonexistent.txt && echo after");
    expect(result.exitCode).not.toBe(0);
    expect(result.stdout).not.toContain("after");
  });

  it("supports || chains", async () => {
    const result = await shell.exec("cat nonexistent.txt || echo fallback");
    expect(result.stdout).toContain("fallback");
    expect(result.exitCode).toBe(0);
  });

  it("supports cd and cwd tracking", async () => {
    volume.mkdirSync("/other", { recursive: true });
    await shell.exec("cd /other");
    expect(shell.getCwd()).toBe("/other");
  });

  it("registerCommand makes commands available to which-style dispatch", async () => {
    const custom: ShellCommand = {
      name: "mycommand",
      execute: async (args) => ({
        stdout: `custom: ${args.join(" ")}\n`,
        stderr: "",
        exitCode: 0,
      }),
    };
    shell.registerCommand(custom);

    const result = await shell.exec("mycommand foo bar");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("custom: foo bar\n");
  });

  it("registered commands work in pipes", async () => {
    shell.registerCommand({
      name: "lines",
      execute: async () => ({
        stdout: "alpha\nbeta\ngamma\n",
        stderr: "",
        exitCode: 0,
      }),
    });

    const result = await shell.exec("lines | grep beta");
    expect(result.exitCode).toBe(0);
    const plain = result.stdout.replace(/\x1b\[[0-9;]*m/g, "").trim();
    expect(plain).toBe("beta");
  });

  it("registered commands work in command substitution", async () => {
    shell.registerCommand({
      name: "getname",
      execute: async () => ({
        stdout: "world",
        stderr: "",
        exitCode: 0,
      }),
    });

    const result = await shell.exec('echo hello $(getname)');
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe("hello world");
  });

  it("output redirection works with registered commands", async () => {
    shell.registerCommand({
      name: "generate",
      execute: async () => ({
        stdout: "generated content",
        stderr: "",
        exitCode: 0,
      }),
    });

    await shell.exec("generate > /project/output.txt");
    const content = volume.readFileSync("/project/output.txt", "utf8");
    expect(content).toBe("generated content");
  });

  it("returns command not found for unknown commands", async () => {
    const result = await shell.exec("unknowncmd");
    expect(result.exitCode).toBe(127);
    expect(result.stderr).toContain("command not found");
  });
});

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { N as NPM_REGISTRY_URL_SLASH, V as VERSIONS, o as ok, r as resolve, f as fail, a as relative, G as GREEN, R as RESET, C as CYAN, c as createHash, p as proxiedFetch, b as NodepodShell, D as DEFAULT_ENV, E as EventEmitter, M as MOCK_PID, W as Writable, d as Readable, S as ScriptEngine, e as format, g as getAllServers, h as ref, u as unref, i as addDrainListener, T as TIMEOUTS, j as closeAllServers, k as resetRefCount, l as resetActiveInterfaceCount, B as Buffer2, m as getActiveContext, n as getRefCount, __tla as __tla_0 } from "./index-DdYRf9qZ.js";
let ShellProcess, clearStreamingCallbacks, child_process, exec, execFile, execFileSync, execSync, executeNodeBinary, fork, getShellCwd, handleIPCFromParent, initShellExec, isStdinRaw, sendStdin, setForkChildCallback, setIPCReceiveHandler, setIPCSend, setShellCwd, setSpawnChildCallback, setStreamingCallbacks, setSyncChannel, shellExec, spawn, spawnSync;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const A_RESET$5 = "\x1B[0m";
  const A_BOLD$5 = "\x1B[1m";
  const A_CYAN$4 = "\x1B[36m";
  function createNpmCommand(deps) {
    return {
      name: "npm",
      async execute(params, ctx) {
        if (!deps.hasFile("/")) return {
          stdout: "",
          stderr: "Volume unavailable\n",
          exitCode: 1
        };
        const sub = params[0];
        if (!sub || sub === "help" || sub === "--help") {
          return {
            stdout: `${A_BOLD$5}Usage:${A_RESET$5} npm <command>

${A_BOLD$5}Commands:${A_RESET$5}
  ${A_CYAN$4}run${A_RESET$5} <script>      Run a package.json script
  ${A_CYAN$4}start${A_RESET$5}             Alias for npm run start
  ${A_CYAN$4}test${A_RESET$5}              Alias for npm run test
  ${A_CYAN$4}install${A_RESET$5} [pkg]     Install packages
  ${A_CYAN$4}uninstall${A_RESET$5} <pkg>   Remove a package
  ${A_CYAN$4}ls${A_RESET$5}                List installed packages
  ${A_CYAN$4}init${A_RESET$5}              Create a package.json
  ${A_CYAN$4}create${A_RESET$5} <pkg>      Create a project (runs create-<pkg>)
  ${A_CYAN$4}version${A_RESET$5}           Show version info
  ${A_CYAN$4}info${A_RESET$5} <pkg>        Show package info
  ${A_CYAN$4}exec${A_RESET$5} <cmd>        Execute a package binary
  ${A_CYAN$4}prefix${A_RESET$5}            Show prefix
  ${A_CYAN$4}root${A_RESET$5}              Show node_modules path
  ${A_CYAN$4}bin${A_RESET$5}               Show bin directory
  ${A_CYAN$4}config${A_RESET$5}            Manage configuration
`,
            stderr: "",
            exitCode: 0
          };
        }
        switch (sub) {
          case "run":
          case "run-script":
            return deps.runScript(params.slice(1), ctx);
          case "start":
            return deps.runScript([
              "start"
            ], ctx);
          case "test":
          case "t":
          case "tst":
            return deps.runScript([
              "test"
            ], ctx);
          case "install":
          case "i":
          case "add":
            return deps.installPackages(params.slice(1), ctx);
          case "ci":
            try {
              deps.removeNodeModules(ctx.cwd);
            } catch {
            }
            return deps.installPackages([], ctx);
          case "uninstall":
          case "remove":
          case "rm":
          case "un":
            return deps.uninstallPackages(params.slice(1), ctx);
          case "ls":
          case "list":
            return deps.listPackages(ctx);
          case "init":
          case "create":
            return deps.npmInitOrCreate(params.slice(1), sub, ctx);
          case "version":
          case "-v":
          case "--version":
            return {
              stdout: VERSIONS.NPM + "\n",
              stderr: "",
              exitCode: 0
            };
          case "info":
          case "view":
          case "show":
            return deps.npmInfo(params.slice(1), ctx);
          case "exec":
            return deps.npxExecute(params.slice(1), ctx);
          case "prefix":
            return {
              stdout: ctx.cwd + "\n",
              stderr: "",
              exitCode: 0
            };
          case "root":
            return {
              stdout: ctx.cwd + "/node_modules\n",
              stderr: "",
              exitCode: 0
            };
          case "bin":
            return {
              stdout: ctx.cwd + "/node_modules/.bin\n",
              stderr: "",
              exitCode: 0
            };
          case "pack":
            return deps.npmPack(ctx);
          case "config":
          case "c":
            return deps.npmConfig(params.slice(1), ctx);
          case "outdated":
            return {
              stdout: "",
              stderr: deps.formatWarn("outdated check not available in nodepod", "npm"),
              exitCode: 0
            };
          case "audit":
            return {
              stdout: "found 0 vulnerabilities\n",
              stderr: "",
              exitCode: 0
            };
          case "fund":
            return {
              stdout: "0 packages are looking for funding\n",
              stderr: "",
              exitCode: 0
            };
          case "cache":
            if (params[1] === "clean" || params[1] === "clear") {
              return {
                stdout: "Cache cleared.\n",
                stderr: "",
                exitCode: 0
              };
            }
            return {
              stdout: "",
              stderr: deps.formatErr(`cache: unknown subcommand ${params[1] ?? ""}`, "npm"),
              exitCode: 1
            };
          case "whoami":
            return {
              stdout: "nodepod-user\n",
              stderr: "",
              exitCode: 0
            };
          case "ping":
            return {
              stdout: `PING ${NPM_REGISTRY_URL_SLASH} - ok
`,
              stderr: "",
              exitCode: 0
            };
          case "set-script": {
            const scriptName = params[1];
            const scriptCmd = params.slice(2).join(" ");
            if (!scriptName || !scriptCmd) {
              return {
                stdout: "",
                stderr: deps.formatErr("Usage: npm set-script <name> <command>", "npm"),
                exitCode: 1
              };
            }
            try {
              const pkgPath = ctx.cwd + "/package.json";
              const raw = deps.readFile(pkgPath);
              const pkg = JSON.parse(raw);
              if (!pkg.scripts) pkg.scripts = {};
              pkg.scripts[scriptName] = scriptCmd;
              deps.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
              return {
                stdout: "",
                stderr: deps.formatWarn('`set-script` is deprecated. Use `npm pkg set scripts.${scriptName}="${scriptCmd}"` instead.', "npm"),
                exitCode: 0
              };
            } catch (e) {
              return {
                stdout: "",
                stderr: deps.formatErr(e.message || "Failed to update package.json", "npm"),
                exitCode: 1
              };
            }
          }
          case "pkg":
            return deps.npmPkg ? deps.npmPkg(params.slice(1), ctx) : {
              stdout: "",
              stderr: deps.formatErr("npm pkg not implemented", "npm"),
              exitCode: 1
            };
          default:
            return {
              stdout: "",
              stderr: deps.formatErr(`Unknown command "${sub}"`, "npm"),
              exitCode: 1
            };
        }
      }
    };
  }
  const A_RESET$4 = "\x1B[0m";
  const A_BOLD$4 = "\x1B[1m";
  const A_CYAN$3 = "\x1B[36m";
  function createPnpmCommand(deps) {
    return {
      name: "pnpm",
      async execute(params, ctx) {
        if (!deps.hasFile("/")) return {
          stdout: "",
          stderr: "Volume unavailable\n",
          exitCode: 1
        };
        const sub = params[0];
        if (!sub || sub === "help" || sub === "--help") {
          return {
            stdout: `${A_BOLD$4}Usage:${A_RESET$4} pnpm <command>

${A_BOLD$4}Manage your dependencies:${A_RESET$4}
  ${A_CYAN$3}add${A_RESET$4} [pkg]         Install packages
  ${A_CYAN$3}install${A_RESET$4}           Install from manifest
  ${A_CYAN$3}remove${A_RESET$4} <pkg>      Remove a package
  ${A_CYAN$3}list${A_RESET$4}              List installed packages

${A_BOLD$4}Run your scripts:${A_RESET$4}
  ${A_CYAN$3}run${A_RESET$4} <script>      Run a script
  ${A_CYAN$3}exec${A_RESET$4} <cmd>        Execute a package binary
  ${A_CYAN$3}dlx${A_RESET$4} <pkg>         Download and execute a package

${A_BOLD$4}Create a project:${A_RESET$4}
  ${A_CYAN$3}init${A_RESET$4}              Create a package.json
  ${A_CYAN$3}create${A_RESET$4} <pkg>      Create a project

  ${A_CYAN$3}version${A_RESET$4}           Show version info
`,
            stderr: "",
            exitCode: 0
          };
        }
        switch (sub) {
          case "add":
            return deps.installPackages(params.slice(1), ctx, "pnpm");
          case "install":
          case "i":
            return deps.installPackages(params.slice(1), ctx, "pnpm");
          case "remove":
          case "rm":
          case "uninstall":
          case "un":
            return deps.uninstallPackages(params.slice(1), ctx, "pnpm");
          case "list":
          case "ls":
            return deps.listPackages(ctx, "pnpm");
          case "run":
            return deps.runScript(params.slice(1), ctx);
          case "start":
            return deps.runScript([
              "start"
            ], ctx);
          case "test":
          case "t":
            return deps.runScript([
              "test"
            ], ctx);
          case "exec":
            return deps.npxExecute(params.slice(1), ctx);
          case "dlx":
            return deps.npxExecute(params.slice(1), ctx);
          case "init":
          case "create":
            return deps.npmInitOrCreate(params.slice(1), sub, ctx);
          case "version":
          case "-v":
          case "--version":
            return {
              stdout: VERSIONS.PNPM + "\n",
              stderr: "",
              exitCode: 0
            };
          case "audit":
            return {
              stdout: "No known vulnerabilities found\n",
              stderr: "",
              exitCode: 0
            };
          case "outdated":
            return {
              stdout: "",
              stderr: "",
              exitCode: 0
            };
          case "why":
            return {
              stdout: "",
              stderr: deps.formatWarn("why: not available in nodepod", "pnpm"),
              exitCode: 0
            };
          default:
            return {
              stdout: "",
              stderr: deps.formatErr(`Unknown command "${sub}"`, "pnpm"),
              exitCode: 1
            };
        }
      }
    };
  }
  const A_RESET$3 = "\x1B[0m";
  const A_BOLD$3 = "\x1B[1m";
  const A_CYAN$2 = "\x1B[36m";
  function createYarnCommand(deps) {
    return {
      name: "yarn",
      async execute(params, ctx) {
        if (!deps.hasFile("/")) return {
          stdout: "",
          stderr: "Volume unavailable\n",
          exitCode: 1
        };
        const sub = params[0];
        if (!sub) return deps.installPackages([], ctx, "yarn");
        if (sub === "help" || sub === "--help") {
          return {
            stdout: `${A_BOLD$3}Usage:${A_RESET$3} yarn <command>

${A_BOLD$3}Commands:${A_RESET$3}
  ${A_CYAN$2}add${A_RESET$3} [pkg]         Install packages
  ${A_CYAN$2}install${A_RESET$3}           Install from manifest
  ${A_CYAN$2}remove${A_RESET$3} <pkg>      Remove a package
  ${A_CYAN$2}list${A_RESET$3}              List installed packages
  ${A_CYAN$2}run${A_RESET$3} <script>      Run a script
  ${A_CYAN$2}dlx${A_RESET$3} <pkg>         Download and execute a package
  ${A_CYAN$2}init${A_RESET$3}              Create a package.json
  ${A_CYAN$2}create${A_RESET$3} <pkg>      Create a project
  ${A_CYAN$2}version${A_RESET$3}           Show version info
`,
            stderr: "",
            exitCode: 0
          };
        }
        switch (sub) {
          case "add":
            return deps.installPackages(params.slice(1), ctx, "yarn");
          case "install":
          case "i":
            return deps.installPackages(params.slice(1), ctx, "yarn");
          case "remove":
          case "rm":
          case "uninstall":
            return deps.uninstallPackages(params.slice(1), ctx, "yarn");
          case "list":
          case "ls":
            return deps.listPackages(ctx, "yarn");
          case "run":
            return deps.runScript(params.slice(1), ctx);
          case "start":
            return deps.runScript([
              "start"
            ], ctx);
          case "test":
          case "t":
            return deps.runScript([
              "test"
            ], ctx);
          case "exec":
            return deps.npxExecute(params.slice(1), ctx);
          case "dlx":
            return deps.npxExecute(params.slice(1), ctx);
          case "init":
          case "create":
            return deps.npmInitOrCreate(params.slice(1), sub, ctx);
          case "version":
          case "-v":
          case "--version":
            return {
              stdout: VERSIONS.YARN + "\n",
              stderr: "",
              exitCode: 0
            };
          case "info":
            return deps.npmInfo(params.slice(1), ctx);
          case "audit":
            return {
              stdout: "0 vulnerabilities found\n",
              stderr: "",
              exitCode: 0
            };
          case "outdated":
            return {
              stdout: "",
              stderr: "",
              exitCode: 0
            };
          case "why":
            return {
              stdout: "",
              stderr: deps.formatWarn("why: not available in nodepod", "yarn"),
              exitCode: 0
            };
          case "global":
            return {
              stdout: "",
              stderr: deps.formatWarn("global: not available in nodepod", "yarn"),
              exitCode: 0
            };
          default:
            return deps.runScript(params, ctx);
        }
      }
    };
  }
  const A_RESET$2 = "\x1B[0m";
  const A_BOLD$2 = "\x1B[1m";
  const A_DIM$1 = "\x1B[2m";
  const A_GREEN$1 = "\x1B[32m";
  const A_CYAN$1 = "\x1B[36m";
  function createBunCommand(deps) {
    return {
      name: "bun",
      async execute(params, ctx) {
        if (!deps.hasFile("/")) return {
          stdout: "",
          stderr: "Volume unavailable\n",
          exitCode: 1
        };
        const sub = params[0];
        if (!sub || sub === "help" || sub === "--help") {
          return {
            stdout: `${A_BOLD$2}Bun${A_RESET$2} is a fast JavaScript runtime, package manager, and bundler.

${A_DIM$1}Usage:${A_RESET$2} bun <command> [...flags] [...args]

${A_BOLD$2}Commands:${A_RESET$2}
  ${A_CYAN$1}run${A_RESET$2}       ${A_DIM$1}Run a package.json script or file${A_RESET$2}
  ${A_CYAN$1}install${A_RESET$2}   ${A_DIM$1}Install dependencies from package.json${A_RESET$2}
  ${A_CYAN$1}add${A_RESET$2}       ${A_DIM$1}Add a dependency${A_RESET$2}
  ${A_CYAN$1}remove${A_RESET$2}    ${A_DIM$1}Remove a dependency${A_RESET$2}
  ${A_CYAN$1}init${A_RESET$2}      ${A_DIM$1}Start an empty Bun project${A_RESET$2}
  ${A_CYAN$1}create${A_RESET$2}    ${A_DIM$1}Create a new project from a template${A_RESET$2}
  ${A_CYAN$1}test${A_RESET$2}      ${A_DIM$1}Run unit tests${A_RESET$2}
  ${A_CYAN$1}x${A_RESET$2}         ${A_DIM$1}Execute a package binary (bunx)${A_RESET$2}
  ${A_CYAN$1}pm${A_RESET$2}        ${A_DIM$1}Package manager utilities${A_RESET$2}
`,
            stderr: "",
            exitCode: 0
          };
        }
        switch (sub) {
          case "run":
            if (params[1] && (params[1].endsWith(".js") || params[1].endsWith(".ts") || params[1].endsWith(".mjs") || params[1].endsWith(".tsx") || params[1].endsWith(".jsx"))) {
              return deps.executeNodeBinary(params[1], params.slice(2), ctx);
            }
            return deps.runScript(params.slice(1), ctx);
          case "start":
            return deps.runScript([
              "start"
            ], ctx);
          case "test":
          case "t":
            return deps.runScript([
              "test"
            ], ctx);
          case "install":
          case "i":
            return deps.installPackages(params.slice(1), ctx, "bun");
          case "add":
            return deps.installPackages(params.slice(1), ctx, "bun");
          case "remove":
          case "rm":
            return deps.uninstallPackages(params.slice(1), ctx, "bun");
          case "x":
            return deps.npxExecute(params.slice(1), ctx);
          case "init":
          case "create":
            return deps.npmInitOrCreate(params.slice(1), sub, ctx);
          case "pm": {
            const pmSub = params[1];
            if (pmSub === "ls" || pmSub === "list") return deps.listPackages(ctx, "bun");
            if (pmSub === "cache") return {
              stdout: "Cache path: /tmp/bun-cache\n",
              stderr: "",
              exitCode: 0
            };
            return {
              stdout: `${A_DIM$1}bun pm: available subcommands: ls, cache${A_RESET$2}
`,
              stderr: "",
              exitCode: 0
            };
          }
          case "version":
          case "-v":
          case "--version":
            return {
              stdout: VERSIONS.BUN + "\n",
              stderr: "",
              exitCode: 0
            };
          case "upgrade":
            return {
              stdout: `${A_GREEN$1}Bun is already up to date.${A_RESET$2}
`,
              stderr: "",
              exitCode: 0
            };
          default: {
            if (params[0] && !params[0].startsWith("-")) {
              const filePath = params[0].startsWith("/") ? params[0] : `${ctx.cwd}/${params[0]}`.replace(/\/+/g, "/");
              if (deps.hasFile(filePath)) {
                return deps.executeNodeBinary(params[0], params.slice(1), ctx);
              }
              return deps.runScript(params, ctx);
            }
            return {
              stdout: "",
              stderr: `error: unknown command "${sub}"
`,
              exitCode: 1
            };
          }
        }
      }
    };
  }
  function createBunxCommand(deps) {
    return {
      name: "bunx",
      async execute(params, ctx) {
        return deps.npxExecute(params, ctx);
      }
    };
  }
  const A_RESET$1 = "\x1B[0m";
  const A_BOLD$1 = "\x1B[1m";
  function createNodeCommand(deps) {
    return {
      name: "node",
      async execute(params, ctx) {
        if (!deps.hasFile("/")) return {
          stdout: "",
          stderr: "Volume unavailable\n",
          exitCode: 1
        };
        let target = null;
        let evalCode = null;
        let printCode = null;
        const scriptArgs = [];
        let collectingArgs = false;
        for (let i = 0; i < params.length; i++) {
          if (collectingArgs) {
            scriptArgs.push(params[i]);
            continue;
          }
          if (params[i] === "-e" || params[i] === "--eval") {
            evalCode = params[++i] ?? "";
          } else if (params[i] === "-p" || params[i] === "--print") {
            printCode = params[++i] ?? "";
          } else if (params[i] === "--version" || params[i] === "-v") {
            return {
              stdout: VERSIONS.NODE + "\n",
              stderr: "",
              exitCode: 0
            };
          } else if (params[i] === "--help" || params[i] === "-h") {
            return {
              stdout: `${A_BOLD$1}Usage:${A_RESET$1} node [options] [script.js] [arguments]
`,
              stderr: "",
              exitCode: 0
            };
          } else if (params[i] === "-r" || params[i] === "--require" || params[i] === "--experimental-specifier-resolution" || params[i] === "--loader" || params[i] === "--import") {
            i++;
          } else if (params[i].startsWith("-")) ;
          else {
            target = params[i];
            collectingArgs = true;
          }
        }
        if (evalCode !== null) {
          return deps.evalCode(evalCode, ctx);
        }
        if (printCode !== null) {
          return deps.printCode(printCode, ctx);
        }
        if (!target) return {
          stdout: "",
          stderr: `${A_BOLD$1}Usage:${A_RESET$1} node <file> [args...]
`,
          exitCode: 1
        };
        return deps.executeNodeBinary(target, scriptArgs, ctx);
      }
    };
  }
  function createNpxCommand(deps) {
    return {
      name: "npx",
      async execute(params, ctx) {
        return deps.npxExecute(params, ctx);
      }
    };
  }
  const RED = "\x1B[31m";
  const YELLOW = "\x1B[33m";
  const BOLD = "\x1B[1m";
  function myersDiff(oldLines, newLines) {
    const N = oldLines.length;
    const M = newLines.length;
    const MAX = N + M;
    if (MAX === 0) return [];
    const vHistory = [];
    const v = /* @__PURE__ */ new Map();
    v.set(1, 0);
    let foundD = -1;
    outer: for (let d = 0; d <= MAX; d++) {
      vHistory.push(new Map(v));
      for (let k = -d; k <= d; k += 2) {
        let x2;
        if (k === -d || k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0)) {
          x2 = v.get(k + 1) ?? 0;
        } else {
          x2 = (v.get(k - 1) ?? 0) + 1;
        }
        let y2 = x2 - k;
        while (x2 < N && y2 < M && oldLines[x2] === newLines[y2]) {
          x2++;
          y2++;
        }
        v.set(k, x2);
        if (x2 >= N && y2 >= M) {
          foundD = d;
          break outer;
        }
      }
    }
    if (foundD < 0) foundD = MAX;
    let x = N;
    let y = M;
    const ops = [];
    for (let d = foundD; d > 0; d--) {
      const vPrev = vHistory[d];
      const k = x - y;
      let prevK;
      if (k === -d || k !== d && (vPrev.get(k - 1) ?? 0) < (vPrev.get(k + 1) ?? 0)) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      const prevX = vPrev.get(prevK) ?? 0;
      const prevY = prevX - prevK;
      while (x > prevX && y > prevY) {
        x--;
        y--;
        ops.push({
          kind: "equal",
          oldIdx: x,
          newIdx: y,
          line: oldLines[x]
        });
      }
      if (d > 0) {
        if (x === prevX) {
          y--;
          ops.push({
            kind: "insert",
            oldIdx: -1,
            newIdx: y,
            line: newLines[y]
          });
        } else {
          x--;
          ops.push({
            kind: "delete",
            oldIdx: x,
            newIdx: -1,
            line: oldLines[x]
          });
        }
      }
    }
    while (x > 0 && y > 0) {
      x--;
      y--;
      ops.push({
        kind: "equal",
        oldIdx: x,
        newIdx: y,
        line: oldLines[x]
      });
    }
    ops.reverse();
    return ops;
  }
  function buildHunks(ops, contextLines = 3) {
    const hunks = [];
    if (ops.length === 0) return hunks;
    const changeIndices = [];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i].kind !== "equal") changeIndices.push(i);
    }
    if (changeIndices.length === 0) return hunks;
    let groupStart = changeIndices[0];
    let groupEnd = changeIndices[0];
    const groups = [];
    for (let i = 1; i < changeIndices.length; i++) {
      if (changeIndices[i] - groupEnd <= contextLines * 2) {
        groupEnd = changeIndices[i];
      } else {
        groups.push([
          groupStart,
          groupEnd
        ]);
        groupStart = changeIndices[i];
        groupEnd = changeIndices[i];
      }
    }
    groups.push([
      groupStart,
      groupEnd
    ]);
    for (const [gStart, gEnd] of groups) {
      const hunkOpsStart = Math.max(0, gStart - contextLines);
      const hunkOpsEnd = Math.min(ops.length - 1, gEnd + contextLines);
      const hunkOps = ops.slice(hunkOpsStart, hunkOpsEnd + 1);
      let oldStart = Infinity;
      let newStart = Infinity;
      let oldCount = 0;
      let newCount = 0;
      for (const op of hunkOps) {
        if (op.kind === "equal") {
          if (op.oldIdx < oldStart) oldStart = op.oldIdx;
          if (op.newIdx < newStart) newStart = op.newIdx;
          oldCount++;
          newCount++;
        } else if (op.kind === "delete") {
          if (op.oldIdx < oldStart) oldStart = op.oldIdx;
          oldCount++;
        } else {
          if (op.newIdx < newStart) newStart = op.newIdx;
          newCount++;
        }
      }
      hunks.push({
        oldStart: (oldStart === Infinity ? 0 : oldStart) + 1,
        oldCount,
        newStart: (newStart === Infinity ? 0 : newStart) + 1,
        newCount,
        lines: hunkOps
      });
    }
    return hunks;
  }
  function countChanges(ops) {
    let insertions = 0;
    let deletions = 0;
    for (const op of ops) {
      if (op.kind === "insert") insertions++;
      else if (op.kind === "delete") deletions++;
    }
    return {
      insertions,
      deletions
    };
  }
  class GitRepo {
    constructor(vol, workDir, gitDir) {
      __publicField(this, "vol");
      __publicField(this, "gitDir");
      __publicField(this, "workDir");
      this.vol = vol;
      this.workDir = workDir;
      this.gitDir = gitDir;
    }
    readStore() {
      try {
        const raw = this.vol.readFileSync(this.gitDir + "/objects/store.json", "utf8");
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    writeStore(store) {
      this.vol.writeFileSync(this.gitDir + "/objects/store.json", JSON.stringify(store));
    }
    hashContent(type, content) {
      const header = `${type} ${content.length}\0`;
      return createHash("sha1").update(header + content).digest("hex");
    }
    writeObject(type, content) {
      const hash = this.hashContent(type, content);
      const store = this.readStore();
      if (!store[hash]) {
        store[hash] = {
          type,
          data: content
        };
        this.writeStore(store);
      }
      return hash;
    }
    readObject(hash) {
      const store = this.readStore();
      return store[hash] ?? null;
    }
    readIndex() {
      try {
        const raw = this.vol.readFileSync(this.gitDir + "/index", "utf8");
        return JSON.parse(raw).entries ?? [];
      } catch {
        return [];
      }
    }
    writeIndex(entries) {
      this.vol.writeFileSync(this.gitDir + "/index", JSON.stringify({
        entries
      }));
    }
    addToIndex(relPath, content) {
      const hash = this.writeObject("blob", content);
      const entries = this.readIndex();
      const idx = entries.findIndex((e) => e.path === relPath);
      const entry = {
        path: relPath,
        hash,
        mode: 100644,
        mtime: Date.now()
      };
      if (idx >= 0) entries[idx] = entry;
      else entries.push(entry);
      entries.sort((a, b) => a.path.localeCompare(b.path));
      this.writeIndex(entries);
    }
    removeFromIndex(relPath) {
      const entries = this.readIndex().filter((e) => e.path !== relPath);
      this.writeIndex(entries);
    }
    getHEAD() {
      try {
        return this.vol.readFileSync(this.gitDir + "/HEAD", "utf8").trim();
      } catch {
        return "ref: refs/heads/main";
      }
    }
    setHEAD(value) {
      this.vol.writeFileSync(this.gitDir + "/HEAD", value + "\n");
    }
    getCurrentBranch() {
      const head = this.getHEAD();
      if (head.startsWith("ref: refs/heads/")) return head.slice(16);
      return null;
    }
    resolveRef(ref2) {
      if (/^[0-9a-f]{40}$/.test(ref2)) return ref2;
      if (ref2.startsWith("ref: ")) {
        const target = ref2.slice(5);
        try {
          return this.vol.readFileSync(this.gitDir + "/" + target, "utf8").trim();
        } catch {
          return null;
        }
      }
      try {
        return this.vol.readFileSync(this.gitDir + "/refs/heads/" + ref2, "utf8").trim();
      } catch {
      }
      try {
        return this.vol.readFileSync(this.gitDir + "/refs/tags/" + ref2, "utf8").trim();
      } catch {
      }
      return null;
    }
    resolveHEAD() {
      return this.resolveRef(this.getHEAD());
    }
    updateBranchRef(branch, hash) {
      const refPath = this.gitDir + "/refs/heads/" + branch;
      const dir = refPath.substring(0, refPath.lastIndexOf("/"));
      if (!this.vol.existsSync(dir)) this.vol.mkdirSync(dir, {
        recursive: true
      });
      this.vol.writeFileSync(refPath, hash + "\n");
    }
    listBranches() {
      try {
        return this.vol.readdirSync(this.gitDir + "/refs/heads");
      } catch {
        return [];
      }
    }
    deleteBranch(name) {
      try {
        const refPath = this.gitDir + "/refs/heads/" + name;
        if (this.vol.existsSync(refPath)) {
          this.vol.unlinkSync(refPath);
          return true;
        }
      } catch {
      }
      return false;
    }
    readConfig() {
      try {
        return this.vol.readFileSync(this.gitDir + "/config", "utf8");
      } catch {
        return "";
      }
    }
    writeConfig(content) {
      this.vol.writeFileSync(this.gitDir + "/config", content);
    }
    getConfigValue(key) {
      const config = this.readConfig();
      const parts = key.split(".");
      if (parts.length < 2) return null;
      let sectionName;
      let subSection = null;
      let propName;
      if (parts.length === 3) {
        sectionName = parts[0];
        subSection = parts[1];
        propName = parts[2];
      } else {
        sectionName = parts[0];
        propName = parts[1];
      }
      const lines = config.split("\n");
      let inSection = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("[")) {
          if (subSection) {
            const pat = `[${sectionName} "${subSection}"]`;
            inSection = trimmed === pat;
          } else {
            inSection = trimmed === `[${sectionName}]`;
          }
          continue;
        }
        if (inSection) {
          const match = trimmed.match(/^(\w+)\s*=\s*(.*)$/);
          if (match && match[1] === propName) return match[2].trim();
        }
      }
      return null;
    }
    setConfigValue(key, value) {
      const parts = key.split(".");
      let sectionHeader;
      let propName;
      if (parts.length === 3) {
        sectionHeader = `[${parts[0]} "${parts[1]}"]`;
        propName = parts[2];
      } else if (parts.length === 2) {
        sectionHeader = `[${parts[0]}]`;
        propName = parts[1];
      } else {
        return;
      }
      const config = this.readConfig();
      const lines = config.split("\n");
      let sectionIdx = -1;
      let propIdx = -1;
      let inSection = false;
      let lastLineInSection = -1;
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("[")) {
          if (inSection && propIdx === -1) lastLineInSection = i - 1;
          inSection = trimmed === sectionHeader;
          if (inSection) sectionIdx = i;
          continue;
        }
        if (inSection) {
          lastLineInSection = i;
          const match = trimmed.match(/^(\w+)\s*=\s*(.*)$/);
          if (match && match[1] === propName) propIdx = i;
        }
      }
      if (inSection && lastLineInSection === -1) lastLineInSection = sectionIdx;
      if (propIdx >= 0) {
        lines[propIdx] = `	${propName} = ${value}`;
      } else if (sectionIdx >= 0) {
        lines.splice(lastLineInSection + 1, 0, `	${propName} = ${value}`);
      } else {
        if (lines.length > 0 && lines[lines.length - 1] !== "") lines.push("");
        lines.push(sectionHeader);
        lines.push(`	${propName} = ${value}`);
      }
      this.writeConfig(lines.join("\n"));
    }
    buildTree(entries) {
      const root = [];
      const subdirs = /* @__PURE__ */ new Map();
      for (const e of entries) {
        const slashIdx = e.path.indexOf("/");
        if (slashIdx === -1) {
          root.push({
            name: e.path,
            mode: String(e.mode),
            type: "blob",
            hash: e.hash
          });
        } else {
          const dir = e.path.substring(0, slashIdx);
          const rest = {
            ...e,
            path: e.path.substring(slashIdx + 1)
          };
          if (!subdirs.has(dir)) subdirs.set(dir, []);
          subdirs.get(dir).push(rest);
        }
      }
      for (const [dir, subEntries] of subdirs) {
        const treeHash = this.buildTree(subEntries);
        root.push({
          name: dir,
          mode: "40000",
          type: "tree",
          hash: treeHash
        });
      }
      root.sort((a, b) => a.name.localeCompare(b.name));
      const treeContent = JSON.stringify(root);
      return this.writeObject("tree", treeContent);
    }
    createCommit(message, parent, tree, parent2) {
      const author = `${this.getConfigValue("user.name") ?? "nodepod-user"} <${this.getConfigValue("user.email") ?? "user@nodepod.dev"}>`;
      const data = {
        tree,
        parent,
        author,
        committer: author,
        timestamp: Date.now(),
        message
      };
      if (parent2) data.parent2 = parent2;
      return this.writeObject("commit", JSON.stringify(data));
    }
    readCommit(hash) {
      const obj = this.readObject(hash);
      if (!obj || obj.type !== "commit") return null;
      return JSON.parse(obj.data);
    }
    walkLog(startHash, limit) {
      const result = [];
      let current = startHash;
      while (current && result.length < limit) {
        const commit = this.readCommit(current);
        if (!commit) break;
        result.push({
          hash: current,
          ...commit
        });
        current = commit.parent;
      }
      return result;
    }
    getCommitTree(commitHash) {
      const commit = this.readCommit(commitHash);
      if (!commit) return /* @__PURE__ */ new Map();
      return this.flattenTree(commit.tree, "");
    }
    flattenTree(treeHash, prefix) {
      const obj = this.readObject(treeHash);
      if (!obj || obj.type !== "tree") return /* @__PURE__ */ new Map();
      const entries = JSON.parse(obj.data);
      const result = /* @__PURE__ */ new Map();
      for (const e of entries) {
        const fullPath = prefix ? prefix + "/" + e.name : e.name;
        if (e.type === "blob") {
          result.set(fullPath, e.hash);
        } else {
          for (const [k, v] of this.flattenTree(e.hash, fullPath)) {
            result.set(k, v);
          }
        }
      }
      return result;
    }
    getBlobContent(hash) {
      const obj = this.readObject(hash);
      if (!obj || obj.type !== "blob") return null;
      return obj.data;
    }
    diffWorkingVsIndex() {
      const index = this.readIndex();
      const indexMap = new Map(index.map((e) => [
        e.path,
        e.hash
      ]));
      const result = [];
      const seen = /* @__PURE__ */ new Set();
      this.walkWorkTree(this.workDir, "", (relPath, content) => {
        seen.add(relPath);
        const currentHash = this.hashContent("blob", content);
        const indexHash = indexMap.get(relPath);
        if (!indexHash) ;
        else if (currentHash !== indexHash) {
          result.push({
            path: relPath,
            status: "modified",
            oldContent: this.getBlobContent(indexHash) ?? "",
            newContent: content
          });
        }
      });
      for (const e of index) {
        if (!seen.has(e.path)) {
          result.push({
            path: e.path,
            status: "deleted",
            oldContent: this.getBlobContent(e.hash) ?? ""
          });
        }
      }
      return result;
    }
    diffIndexVsHEAD() {
      const index = this.readIndex();
      const headHash = this.resolveHEAD();
      const headTree = headHash ? this.getCommitTree(headHash) : /* @__PURE__ */ new Map();
      const result = [];
      const indexMap = new Map(index.map((e) => [
        e.path,
        e.hash
      ]));
      for (const e of index) {
        const headBlobHash = headTree.get(e.path);
        if (!headBlobHash) {
          result.push({
            path: e.path,
            status: "added"
          });
        } else if (headBlobHash !== e.hash) {
          result.push({
            path: e.path,
            status: "modified"
          });
        }
      }
      for (const [path] of headTree) {
        if (!indexMap.has(path)) {
          result.push({
            path,
            status: "deleted"
          });
        }
      }
      return result;
    }
    getUntrackedFiles() {
      const index = this.readIndex();
      const indexPaths = new Set(index.map((e) => e.path));
      const untracked = [];
      this.walkWorkTree(this.workDir, "", (relPath) => {
        if (!indexPaths.has(relPath)) untracked.push(relPath);
      });
      return untracked.sort();
    }
    walkWorkTree(dir, prefix, cb) {
      let entries;
      try {
        entries = this.vol.readdirSync(dir);
      } catch {
        return;
      }
      for (const name of entries) {
        if (name === ".git" || name === "node_modules") continue;
        const fullPath = dir + "/" + name;
        try {
          const stat = this.vol.statSync(fullPath);
          if (stat.isDirectory()) {
            this.walkWorkTree(fullPath, prefix ? prefix + "/" + name : name, cb);
          } else if (stat.isFile()) {
            const relPath = prefix ? prefix + "/" + name : name;
            const content = this.vol.readFileSync(fullPath, "utf8");
            cb(relPath, content);
          }
        } catch {
        }
      }
    }
    readStashList() {
      try {
        const raw = this.vol.readFileSync(this.gitDir + "/refs/stash", "utf8");
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    writeStashList(list) {
      const dir = this.gitDir + "/refs";
      if (!this.vol.existsSync(dir)) this.vol.mkdirSync(dir, {
        recursive: true
      });
      this.vol.writeFileSync(this.gitDir + "/refs/stash", JSON.stringify(list));
    }
    getRemoteUrl(name) {
      return this.getConfigValue(`remote.${name}.url`);
    }
    parseGitHubUrl(url) {
      let m = url.match(/github\.com\/([^/]+)\/([^/.]+?)(?:\.git)?$/);
      if (m) return {
        owner: m[1],
        repo: m[2]
      };
      m = url.match(/github\.com:([^/]+)\/([^/.]+?)(?:\.git)?$/);
      if (m) return {
        owner: m[1],
        repo: m[2]
      };
      return null;
    }
  }
  async function githubApi(path, token, method = "GET", body) {
    const url = `https://api.github.com${path}`;
    const headers = {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
      "User-Agent": "nodepod-git"
    };
    if (body) headers["Content-Type"] = "application/json";
    const resp = await proxiedFetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : void 0
    });
    let data;
    try {
      data = await resp.json();
    } catch {
      data = null;
    }
    return {
      ok: resp.ok,
      status: resp.status,
      data
    };
  }
  function findGitDir(vol, cwd) {
    let dir = cwd;
    while (true) {
      const gitPath = dir + "/.git";
      try {
        if (vol.existsSync(gitPath)) return {
          gitDir: gitPath,
          workDir: dir
        };
      } catch {
      }
      const parent = dir.substring(0, dir.lastIndexOf("/")) || "/";
      if (parent === dir) break;
      dir = parent;
    }
    if (vol.existsSync("/.git")) return {
      gitDir: "/.git",
      workDir: "/"
    };
    return null;
  }
  function requireRepo(vol, cwd) {
    const found = findGitDir(vol, cwd);
    if (!found) {
      return {
        error: fail("fatal: not a git repository (or any of the parent directories): .git\n", 128)
      };
    }
    return {
      repo: new GitRepo(vol, found.workDir, found.gitDir)
    };
  }
  function gitInit(args, ctx) {
    let target = ctx.cwd;
    for (const a of args) {
      if (!a.startsWith("-")) {
        target = resolve(ctx.cwd, a);
        break;
      }
    }
    const gitDir = target + "/.git";
    if (ctx.volume.existsSync(gitDir)) {
      return ok(`Reinitialized existing Git repository in ${gitDir}/
`);
    }
    const dirs = [
      gitDir,
      gitDir + "/objects",
      gitDir + "/refs",
      gitDir + "/refs/heads",
      gitDir + "/refs/tags"
    ];
    for (const d of dirs) {
      if (!ctx.volume.existsSync(d)) ctx.volume.mkdirSync(d, {
        recursive: true
      });
    }
    ctx.volume.writeFileSync(gitDir + "/HEAD", "ref: refs/heads/main\n");
    ctx.volume.writeFileSync(gitDir + "/config", "[core]\n	bare = false\n	filemode = false\n[user]\n	name = nodepod-user\n	email = user@nodepod.dev\n");
    ctx.volume.writeFileSync(gitDir + "/objects/store.json", "{}");
    ctx.volume.writeFileSync(gitDir + "/index", '{"entries":[]}');
    if (!ctx.volume.existsSync(target)) ctx.volume.mkdirSync(target, {
      recursive: true
    });
    return ok(`Initialized empty Git repository in ${gitDir}/
`);
  }
  function gitAdd(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const addAll = args.includes("-A") || args.includes("--all") || args.includes(".");
    const pathspecs = addAll ? [] : args.filter((a) => !a.startsWith("-"));
    if (!addAll && pathspecs.length === 0) {
      return fail("Nothing specified, nothing added.\n");
    }
    if (addAll) {
      repo.walkWorkTree(repo.workDir, "", (relPath, content) => {
        repo.addToIndex(relPath, content);
      });
      const index = repo.readIndex();
      const toRemove = [];
      for (const e of index) {
        const fullPath = repo.workDir + "/" + e.path;
        if (!ctx.volume.existsSync(fullPath)) toRemove.push(e.path);
      }
      for (const p of toRemove) repo.removeFromIndex(p);
    } else {
      for (const spec of pathspecs) {
        const absPath = resolve(ctx.cwd, spec);
        const relPath = relative(repo.workDir, absPath);
        if (relPath.startsWith("..")) continue;
        if (ctx.volume.existsSync(absPath)) {
          try {
            const stat = ctx.volume.statSync(absPath);
            if (stat.isDirectory()) {
              repo.walkWorkTree(absPath, relPath, (rp, content) => {
                repo.addToIndex(rp, content);
              });
            } else {
              const content = ctx.volume.readFileSync(absPath, "utf8");
              repo.addToIndex(relPath, content);
            }
          } catch {
          }
        } else {
          repo.removeFromIndex(relPath);
        }
      }
    }
    return ok("");
  }
  function gitStatus(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const short = args.includes("-s") || args.includes("--short");
    const porcelain = args.includes("--porcelain");
    const staged = repo.diffIndexVsHEAD();
    const unstaged = repo.diffWorkingVsIndex();
    const untracked = repo.getUntrackedFiles();
    if (short || porcelain) {
      let out2 = "";
      for (const d of staged) {
        const code = d.status === "added" ? "A" : d.status === "deleted" ? "D" : "M";
        out2 += `${code}  ${d.path}
`;
      }
      for (const d of unstaged) {
        const code = d.status === "deleted" ? "D" : "M";
        out2 += ` ${code} ${d.path}
`;
      }
      for (const p of untracked) {
        out2 += `?? ${p}
`;
      }
      return ok(out2);
    }
    const branch = repo.getCurrentBranch() ?? "(HEAD detached)";
    let out = `On branch ${branch}
`;
    if (staged.length === 0 && unstaged.length === 0 && untracked.length === 0) {
      out += "nothing to commit, working tree clean\n";
      return ok(out);
    }
    if (staged.length > 0) {
      out += `
Changes to be committed:
`;
      out += `  (use "git restore --staged <file>..." to unstage)
`;
      for (const d of staged) {
        const label = d.status === "added" ? "new file" : d.status === "deleted" ? "deleted" : "modified";
        out += `	${GREEN}${label}:   ${d.path}${RESET}
`;
      }
    }
    if (unstaged.length > 0) {
      out += `
Changes not staged for commit:
`;
      out += `  (use "git add <file>..." to update what will be committed)
`;
      for (const d of unstaged) {
        const label = d.status === "deleted" ? "deleted" : "modified";
        out += `	${RED}${label}:   ${d.path}${RESET}
`;
      }
    }
    if (untracked.length > 0) {
      out += `
Untracked files:
`;
      out += `  (use "git add <file>..." to include in what will be committed)
`;
      for (const p of untracked) {
        out += `	${RED}${p}${RESET}
`;
      }
    }
    return ok(out);
  }
  function gitCommit(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    let message = null;
    let autoStage = false;
    let allowEmpty = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-m" || args[i] === "--message") {
        message = args[++i] ?? "";
      } else if (args[i] === "-a" || args[i] === "--all") {
        autoStage = true;
      } else if (args[i] === "--allow-empty") {
        allowEmpty = true;
      } else if (args[i] === "--allow-empty-message") ;
      else if (args[i].startsWith("-m")) {
        message = args[i].slice(2);
      }
    }
    if (message === null) {
      return fail("error: switch `m' requires a value\n");
    }
    if (autoStage) {
      const index = repo.readIndex();
      for (const e of index) {
        const fullPath = repo.workDir + "/" + e.path;
        if (ctx.volume.existsSync(fullPath)) {
          try {
            const content = ctx.volume.readFileSync(fullPath, "utf8");
            repo.addToIndex(e.path, content);
          } catch {
          }
        } else {
          repo.removeFromIndex(e.path);
        }
      }
    }
    const entries = repo.readIndex();
    const staged = repo.diffIndexVsHEAD();
    if (staged.length === 0 && !allowEmpty) {
      return fail("nothing to commit, working tree clean\n");
    }
    const treeHash = repo.buildTree(entries);
    const parent = repo.resolveHEAD();
    const commitHash = repo.createCommit(message, parent, treeHash);
    const branch = repo.getCurrentBranch();
    if (branch) {
      repo.updateBranchRef(branch, commitHash);
    } else {
      repo.setHEAD(commitHash);
    }
    const shortHash = commitHash.slice(0, 7);
    const branchLabel = branch ?? "HEAD";
    const isRoot = !parent;
    const out = `[${branchLabel}${isRoot ? " (root-commit)" : ""} ${shortHash}] ${message}
 ${staged.length} file${staged.length !== 1 ? "s" : ""} changed
`;
    return ok(out);
  }
  function gitLog(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    let limit = 50;
    let oneline = false;
    let format2 = null;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--oneline") {
        oneline = true;
      } else if (args[i] === "-n" || args[i] === "--max-count") {
        limit = parseInt(args[++i], 10) || 50;
      } else if (args[i].startsWith("-") && /^-\d+$/.test(args[i])) {
        limit = parseInt(args[i].slice(1), 10) || 50;
      } else if (args[i].startsWith("--format=")) {
        format2 = args[i].slice(9);
      } else if (args[i].startsWith("--pretty=format:")) {
        format2 = args[i].slice(16);
      } else if (args[i].startsWith("--pretty=")) {
        format2 = args[i].slice(9);
      }
    }
    const head = repo.resolveHEAD();
    if (!head) return ok("");
    const commits = repo.walkLog(head, limit);
    if (commits.length === 0) return ok("");
    const currentBranch = repo.getCurrentBranch();
    let out = "";
    for (const c of commits) {
      if (format2 !== null) {
        let line = format2.replace(/%H/g, c.hash).replace(/%h/g, c.hash.slice(0, 7)).replace(/%s/g, c.message.split("\n")[0]).replace(/%an/g, c.author.split(" <")[0]).replace(/%ae/g, (c.author.match(/<(.+?)>/) ?? [
          "",
          ""
        ])[1]).replace(/%d/g, c.hash === head && currentBranch ? ` (HEAD -> ${currentBranch})` : "").replace(/%n/g, "\n");
        out += line + "\n";
      } else if (oneline) {
        const decoration = c.hash === head && currentBranch ? ` ${YELLOW}(HEAD -> ${CYAN}${currentBranch}${YELLOW})${RESET}` : "";
        out += `${YELLOW}${c.hash.slice(0, 7)}${RESET}${decoration} ${c.message.split("\n")[0]}
`;
      } else {
        const decoration = c.hash === head && currentBranch ? ` ${YELLOW}(HEAD -> ${CYAN}${currentBranch}${YELLOW})${RESET}` : "";
        out += `${YELLOW}commit ${c.hash}${RESET}${decoration}
`;
        out += `Author: ${c.author}
`;
        out += `Date:   ${new Date(c.timestamp).toUTCString()}
`;
        out += `
    ${c.message}

`;
      }
    }
    return ok(out);
  }
  function gitDiff(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const staged = args.includes("--staged") || args.includes("--cached");
    const stat = args.includes("--stat");
    let diffs;
    if (staged) {
      diffs = repo.diffIndexVsHEAD();
      const headHash = repo.resolveHEAD();
      const headTree = headHash ? repo.getCommitTree(headHash) : /* @__PURE__ */ new Map();
      const index = repo.readIndex();
      const indexMap = new Map(index.map((e) => [
        e.path,
        e.hash
      ]));
      for (const d of diffs) {
        const oldHash = headTree.get(d.path);
        const newHash = indexMap.get(d.path);
        d.oldContent = oldHash ? repo.getBlobContent(oldHash) ?? "" : "";
        d.newContent = newHash ? repo.getBlobContent(newHash) ?? "" : "";
      }
    } else {
      diffs = repo.diffWorkingVsIndex();
    }
    if (diffs.length === 0) return ok("");
    if (stat) {
      let out2 = "";
      let totalIns = 0;
      let totalDel = 0;
      for (const d of diffs) {
        const oldLines = d.oldContent ? d.oldContent.split("\n") : [];
        const newLines = d.newContent ? d.newContent.split("\n") : [];
        const ops = myersDiff(oldLines, newLines);
        const { insertions: ins, deletions: del } = countChanges(ops);
        totalIns += ins;
        totalDel += del;
        out2 += ` ${d.path} | ${ins + del} ${GREEN}${"+".repeat(ins)}${RED}${"-".repeat(del)}${RESET}
`;
      }
      out2 += ` ${diffs.length} file${diffs.length !== 1 ? "s" : ""} changed`;
      if (totalIns > 0) out2 += `, ${totalIns} insertion${totalIns !== 1 ? "s" : ""}(+)`;
      if (totalDel > 0) out2 += `, ${totalDel} deletion${totalDel !== 1 ? "s" : ""}(-)`;
      out2 += "\n";
      return ok(out2);
    }
    let out = "";
    for (const d of diffs) {
      const oldLines = d.oldContent ? d.oldContent.split("\n") : [];
      const newLines = d.newContent ? d.newContent.split("\n") : [];
      out += `${BOLD}diff --git a/${d.path} b/${d.path}${RESET}
`;
      if (d.status === "added") out += "new file mode 100644\n";
      if (d.status === "deleted") out += "deleted file mode 100644\n";
      out += `--- ${d.status === "added" ? "/dev/null" : "a/" + d.path}
`;
      out += `+++ ${d.status === "deleted" ? "/dev/null" : "b/" + d.path}
`;
      const ops = myersDiff(oldLines, newLines);
      const hunks = buildHunks(ops, 3);
      for (const hunk of hunks) {
        out += `${CYAN}@@ -${hunk.oldStart},${hunk.oldCount} +${hunk.newStart},${hunk.newCount} @@${RESET}
`;
        for (const op of hunk.lines) {
          if (op.kind === "equal") {
            out += ` ${op.line}
`;
          } else if (op.kind === "delete") {
            out += `${RED}-${op.line}${RESET}
`;
          } else {
            out += `${GREEN}+${op.line}${RESET}
`;
          }
        }
      }
    }
    return ok(out);
  }
  function gitBranch(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    if (args.includes("--show-current")) {
      const branch = repo.getCurrentBranch();
      return ok(branch ? branch + "\n" : "\n");
    }
    const deleteIdx = args.indexOf("-d") !== -1 ? args.indexOf("-d") : args.indexOf("-D");
    if (deleteIdx >= 0) {
      const name = args[deleteIdx + 1];
      if (!name) return fail("error: branch name required\n");
      if (name === repo.getCurrentBranch()) {
        return fail(`error: Cannot delete branch '${name}' checked out.
`);
      }
      if (repo.deleteBranch(name)) {
        return ok(`Deleted branch ${name}.
`);
      }
      return fail(`error: branch '${name}' not found.
`);
    }
    const renameIdx = args.indexOf("-m");
    if (renameIdx >= 0) {
      const oldName = args[renameIdx + 1];
      const newName = args[renameIdx + 2];
      if (!oldName || !newName) return fail("error: too few arguments to rename\n");
      const hash = repo.resolveRef(oldName);
      if (!hash) return fail(`error: refname ${oldName} not a valid ref
`);
      repo.updateBranchRef(newName, hash);
      repo.deleteBranch(oldName);
      if (repo.getCurrentBranch() === oldName) {
        repo.setHEAD("ref: refs/heads/" + newName);
      }
      return ok(`Branch '${oldName}' renamed to '${newName}'.
`);
    }
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    if (nonFlags.length > 0) {
      const name = nonFlags[0];
      const startPoint = nonFlags[1];
      const hash = startPoint ? repo.resolveRef(startPoint) : repo.resolveHEAD();
      if (!hash) return fail(`fatal: not a valid object name: '${startPoint ?? "HEAD"}'
`, 128);
      repo.updateBranchRef(name, hash);
      return ok("");
    }
    const branches = repo.listBranches();
    const current = repo.getCurrentBranch();
    let out = "";
    for (const b of branches.sort()) {
      if (b === current) {
        out += `* ${GREEN}${b}${RESET}
`;
      } else {
        out += `  ${b}
`;
      }
    }
    return ok(out);
  }
  function gitCheckout(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const createNew = args.includes("-b");
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    if (nonFlags.length === 0) return fail("error: you must specify a branch to checkout\n");
    let target;
    let newBranchName = null;
    if (createNew) {
      const bIdx = args.indexOf("-b");
      newBranchName = args[bIdx + 1];
      if (!newBranchName) return fail("error: switch 'b' requires a value\n");
      target = args[bIdx + 2] ?? repo.getCurrentBranch() ?? "HEAD";
    } else {
      target = nonFlags[0];
    }
    let commitHash = repo.resolveRef(target);
    if (createNew) {
      if (!commitHash) commitHash = repo.resolveHEAD();
      if (!commitHash) return fail(`fatal: not a valid object name: '${target}'
`, 128);
      repo.updateBranchRef(newBranchName, commitHash);
      repo.setHEAD("ref: refs/heads/" + newBranchName);
      return ok(`Switched to a new branch '${newBranchName}'
`);
    }
    const branches = repo.listBranches();
    const isBranch = branches.includes(target);
    if (!commitHash) {
      return fail(`error: pathspec '${target}' did not match any file(s) known to git.
`);
    }
    const currentHead = repo.resolveHEAD();
    if (commitHash !== currentHead) {
      const targetTree = repo.getCommitTree(commitHash);
      const currentTree = currentHead ? repo.getCommitTree(currentHead) : /* @__PURE__ */ new Map();
      for (const [path, blobHash] of targetTree) {
        const content = repo.getBlobContent(blobHash);
        if (content !== null) {
          const fullPath = repo.workDir + "/" + path;
          const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
          if (dir && !ctx.volume.existsSync(dir)) {
            ctx.volume.mkdirSync(dir, {
              recursive: true
            });
          }
          ctx.volume.writeFileSync(fullPath, content);
        }
      }
      for (const [path] of currentTree) {
        if (!targetTree.has(path)) {
          const fullPath = repo.workDir + "/" + path;
          try {
            ctx.volume.unlinkSync(fullPath);
          } catch {
          }
        }
      }
      const newIndex = [];
      for (const [path, blobHash] of targetTree) {
        newIndex.push({
          path,
          hash: blobHash,
          mode: 100644,
          mtime: Date.now()
        });
      }
      newIndex.sort((a, b) => a.path.localeCompare(b.path));
      repo.writeIndex(newIndex);
    }
    if (isBranch) {
      repo.setHEAD("ref: refs/heads/" + target);
      return ok(`Switched to branch '${target}'
`);
    } else {
      repo.setHEAD(commitHash);
      return ok(`HEAD is now at ${commitHash.slice(0, 7)}
`);
    }
  }
  function gitSwitch(args, ctx) {
    const newArgs = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-c" || args[i] === "--create") {
        newArgs.push("-b");
      } else {
        newArgs.push(args[i]);
      }
    }
    return gitCheckout(newArgs, ctx);
  }
  function gitRevParse(args, ctx) {
    const found = findGitDir(ctx.volume, ctx.cwd);
    for (const arg of args) {
      switch (arg) {
        case "--show-toplevel":
          if (!found) return fail("fatal: not a git repository\n", 128);
          return ok(found.workDir + "\n");
        case "--is-inside-work-tree":
          return ok(found ? "true\n" : "false\n");
        case "--git-dir":
          if (!found) return fail("fatal: not a git repository\n", 128);
          return ok(".git\n");
        case "--is-bare-repository":
          return ok("false\n");
        case "--abbrev-ref": {
          const refArg = args[args.indexOf(arg) + 1];
          if (refArg === "HEAD" && found) {
            const repo = new GitRepo(ctx.volume, found.workDir, found.gitDir);
            const branch = repo.getCurrentBranch();
            return ok((branch ?? "HEAD") + "\n");
          }
          return ok("HEAD\n");
        }
        case "--short": {
          const refArg = args[args.indexOf(arg) + 1];
          if (refArg === "HEAD" && found) {
            const repo = new GitRepo(ctx.volume, found.workDir, found.gitDir);
            const hash = repo.resolveHEAD();
            return ok(hash ? hash.slice(0, 7) + "\n" : "\n");
          }
          return ok("\n");
        }
        case "--verify": {
          const refArg = args[args.indexOf(arg) + 1];
          if (!found) return fail("fatal: not a git repository\n", 128);
          const repo = new GitRepo(ctx.volume, found.workDir, found.gitDir);
          if (refArg === "HEAD") {
            const hash = repo.resolveHEAD();
            if (hash) return ok(hash + "\n");
            return fail("fatal: Needed a single revision\n", 128);
          }
          const resolved = repo.resolveRef(refArg ?? "");
          if (resolved) return ok(resolved + "\n");
          return fail(`fatal: Needed a single revision
`, 128);
        }
      }
    }
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    if (nonFlags.length > 0 && found) {
      const repo = new GitRepo(ctx.volume, found.workDir, found.gitDir);
      for (const ref2 of nonFlags) {
        if (ref2 === "HEAD") {
          const hash = repo.resolveHEAD();
          if (hash) return ok(hash + "\n");
        } else {
          const hash = repo.resolveRef(ref2);
          if (hash) return ok(hash + "\n");
        }
      }
    }
    return ok("\n");
  }
  function gitConfig(args, ctx) {
    const found = findGitDir(ctx.volume, ctx.cwd);
    if (args.includes("--list") || args.includes("-l")) {
      if (!found) return fail("fatal: not a git repository\n", 128);
      const repo2 = new GitRepo(ctx.volume, found.workDir, found.gitDir);
      const config = repo2.readConfig();
      const lines = config.split("\n");
      let section = "";
      let subSection = "";
      let out = "";
      for (const line of lines) {
        const trimmed = line.trim();
        const secMatch = trimmed.match(/^\[(\w+)\s*(?:"([^"]*)")?\]$/);
        if (secMatch) {
          section = secMatch[1];
          subSection = secMatch[2] ?? "";
          continue;
        }
        const kvMatch = trimmed.match(/^(\w+)\s*=\s*(.*)$/);
        if (kvMatch && section) {
          const key2 = subSection ? `${section}.${subSection}.${kvMatch[1]}` : `${section}.${kvMatch[1]}`;
          out += `${key2}=${kvMatch[2].trim()}
`;
        }
      }
      return ok(out);
    }
    const filtered = args.filter((a) => a !== "--global" && a !== "--local" && a !== "--get");
    if (filtered.length === 0) return fail("error: key required\n");
    const key = filtered[0];
    const value = filtered[1];
    if (!found) {
      if (value !== void 0) return fail("fatal: not a git repository\n", 128);
      return ok("\n");
    }
    const repo = new GitRepo(ctx.volume, found.workDir, found.gitDir);
    if (value !== void 0) {
      repo.setConfigValue(key, value);
      return ok("");
    }
    const val = repo.getConfigValue(key);
    if (val !== null) return ok(val + "\n");
    return fail("");
  }
  function gitRemote(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const sub = args[0];
    if (sub === "add") {
      const name = args[1];
      const url = args[2];
      if (!name || !url) return fail("usage: git remote add <name> <url>\n");
      repo.setConfigValue(`remote.${name}.url`, url);
      repo.setConfigValue(`remote.${name}.fetch`, `+refs/heads/*:refs/remotes/${name}/*`);
      return ok("");
    }
    if (sub === "remove" || sub === "rm") {
      const name = args[1];
      if (!name) return fail("usage: git remote remove <name>\n");
      const config2 = repo.readConfig();
      const lines2 = config2.split("\n");
      const out2 = [];
      let skip = false;
      for (const line of lines2) {
        if (line.trim() === `[remote "${name}"]`) {
          skip = true;
          continue;
        }
        if (line.trim().startsWith("[") && skip) skip = false;
        if (!skip) out2.push(line);
      }
      repo.writeConfig(out2.join("\n"));
      return ok("");
    }
    if (sub === "get-url") {
      const name = args[1] ?? "origin";
      const url = repo.getRemoteUrl(name);
      if (url) return ok(url + "\n");
      return fail(`fatal: No such remote '${name}'
`, 2);
    }
    const verbose = args.includes("-v") || args.includes("--verbose");
    const config = repo.readConfig();
    const remotes = [];
    const lines = config.split("\n");
    let currentRemote = "";
    for (const line of lines) {
      const match = line.trim().match(/^\[remote\s+"([^"]+)"\]$/);
      if (match) {
        currentRemote = match[1];
        continue;
      }
      if (currentRemote) {
        const kvMatch = line.trim().match(/^url\s*=\s*(.+)$/);
        if (kvMatch) {
          remotes.push({
            name: currentRemote,
            url: kvMatch[1].trim()
          });
          currentRemote = "";
        }
      }
    }
    let out = "";
    for (const r2 of remotes) {
      if (verbose) {
        out += `${r2.name}	${r2.url} (fetch)
`;
        out += `${r2.name}	${r2.url} (push)
`;
      } else {
        out += r2.name + "\n";
      }
    }
    return ok(out);
  }
  function gitMerge(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    if (args.includes("--abort")) {
      try {
        ctx.volume.unlinkSync(repo.gitDir + "/MERGE_HEAD");
        ctx.volume.unlinkSync(repo.gitDir + "/MERGE_MSG");
      } catch {
      }
      return ok("Merge aborted.\n");
    }
    const target = args.filter((a) => !a.startsWith("-"))[0];
    if (!target) return fail("error: specify a branch to merge\n");
    const targetHash = repo.resolveRef(target);
    if (!targetHash) return fail(`merge: ${target} - not something we can merge
`);
    const currentHash = repo.resolveHEAD();
    if (!currentHash) {
      const branch2 = repo.getCurrentBranch();
      if (branch2) repo.updateBranchRef(branch2, targetHash);
      return ok(`Fast-forward
`);
    }
    if (currentHash === targetHash) {
      return ok("Already up to date.\n");
    }
    let walker = targetHash;
    let isFF = false;
    for (let i = 0; i < 1e3; i++) {
      if (walker === currentHash) {
        isFF = true;
        break;
      }
      const commit = repo.readCommit(walker);
      if (!commit || !commit.parent) break;
      walker = commit.parent;
    }
    if (isFF) {
      const branch2 = repo.getCurrentBranch();
      if (branch2) repo.updateBranchRef(branch2, targetHash);
      else repo.setHEAD(targetHash);
      const targetTree = repo.getCommitTree(targetHash);
      for (const [path, blobHash] of targetTree) {
        const content = repo.getBlobContent(blobHash);
        if (content !== null) {
          const fullPath = repo.workDir + "/" + path;
          const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
          if (dir && !ctx.volume.existsSync(dir)) ctx.volume.mkdirSync(dir, {
            recursive: true
          });
          ctx.volume.writeFileSync(fullPath, content);
        }
      }
      const newIndex = [];
      for (const [path, blobHash] of targetTree) {
        newIndex.push({
          path,
          hash: blobHash,
          mode: 100644,
          mtime: Date.now()
        });
      }
      repo.writeIndex(newIndex);
      return ok(`Updating ${currentHash.slice(0, 7)}..${targetHash.slice(0, 7)}
Fast-forward
`);
    }
    const entries = repo.readIndex();
    const treeHash = repo.buildTree(entries);
    const mergeMessage = `Merge branch '${target}'`;
    const mergeHash = repo.createCommit(mergeMessage, currentHash, treeHash, targetHash);
    const branch = repo.getCurrentBranch();
    if (branch) repo.updateBranchRef(branch, mergeHash);
    else repo.setHEAD(mergeHash);
    return ok(`Merge made by the 'recursive' strategy.
`);
  }
  function gitStash(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const sub = args[0] ?? "push";
    if (sub === "list") {
      const list = repo.readStashList();
      let out = "";
      for (let i = 0; i < list.length; i++) {
        out += `stash@{${i}}: ${list[i].message}
`;
      }
      return ok(out);
    }
    if (sub === "push" || sub === "save" || !args[0]) {
      const message = args.find((a) => !a.startsWith("-")) && args[0] !== "push" && args[0] !== "save" ? args.join(" ") : "WIP on " + (repo.getCurrentBranch() ?? "HEAD");
      const unstaged = repo.diffWorkingVsIndex();
      const staged = repo.diffIndexVsHEAD();
      if (unstaged.length === 0 && staged.length === 0) {
        return ok("No local changes to save\n");
      }
      const entries = repo.readIndex();
      repo.walkWorkTree(repo.workDir, "", (relPath, content) => {
        repo.addToIndex(relPath, content);
      });
      const allEntries = repo.readIndex();
      const treeHash = repo.buildTree(allEntries);
      const parent = repo.resolveHEAD();
      const stashHash = repo.createCommit("stash: " + message, parent, treeHash);
      repo.writeIndex(entries);
      const headHash = repo.resolveHEAD();
      if (headHash) {
        const headTree = repo.getCommitTree(headHash);
        for (const [path, blobHash] of headTree) {
          const content = repo.getBlobContent(blobHash);
          if (content !== null) {
            const fullPath = repo.workDir + "/" + path;
            const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
            if (dir && !ctx.volume.existsSync(dir)) ctx.volume.mkdirSync(dir, {
              recursive: true
            });
            ctx.volume.writeFileSync(fullPath, content);
          }
        }
      }
      const list = repo.readStashList();
      list.unshift({
        message,
        commitHash: stashHash
      });
      repo.writeStashList(list);
      return ok(`Saved working directory and index state ${message}
`);
    }
    if (sub === "pop" || sub === "apply") {
      const idxArg = args[1] ? parseInt(args[1], 10) : 0;
      const list = repo.readStashList();
      if (idxArg >= list.length) return fail(`error: stash@{${idxArg}} does not exist
`);
      const entry = list[idxArg];
      const stashTree = repo.getCommitTree(entry.commitHash);
      for (const [path, blobHash] of stashTree) {
        const content = repo.getBlobContent(blobHash);
        if (content !== null) {
          const fullPath = repo.workDir + "/" + path;
          const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
          if (dir && !ctx.volume.existsSync(dir)) ctx.volume.mkdirSync(dir, {
            recursive: true
          });
          ctx.volume.writeFileSync(fullPath, content);
        }
      }
      if (sub === "pop") {
        list.splice(idxArg, 1);
        repo.writeStashList(list);
      }
      return ok(`Applied stash@{${idxArg}}
`);
    }
    if (sub === "drop") {
      const idxArg = args[1] ? parseInt(args[1], 10) : 0;
      const list = repo.readStashList();
      if (idxArg >= list.length) return fail(`error: stash@{${idxArg}} does not exist
`);
      list.splice(idxArg, 1);
      repo.writeStashList(list);
      return ok(`Dropped stash@{${idxArg}}
`);
    }
    return fail(`error: unknown stash subcommand '${sub}'
`);
  }
  function gitRm(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const cached = args.includes("--cached");
    const paths = args.filter((a) => !a.startsWith("-"));
    if (paths.length === 0) return fail("usage: git rm [--cached] <file>...\n");
    for (const p of paths) {
      const absPath = resolve(ctx.cwd, p);
      const relPath = relative(repo.workDir, absPath);
      repo.removeFromIndex(relPath);
      if (!cached) {
        try {
          ctx.volume.unlinkSync(absPath);
        } catch {
        }
      }
    }
    return ok("");
  }
  function gitReset(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const hard = args.includes("--hard");
    const soft = args.includes("--soft");
    const paths = args.filter((a) => !a.startsWith("-"));
    if (paths.length > 0 && !hard && !soft) {
      const headHash = repo.resolveHEAD();
      const headTree = headHash ? repo.getCommitTree(headHash) : /* @__PURE__ */ new Map();
      for (const p of paths) {
        const absPath = resolve(ctx.cwd, p);
        const relPath = relative(repo.workDir, absPath);
        const headBlobHash = headTree.get(relPath);
        if (headBlobHash) {
          const entries = repo.readIndex();
          const idx = entries.findIndex((e) => e.path === relPath);
          if (idx >= 0) {
            entries[idx].hash = headBlobHash;
            repo.writeIndex(entries);
          }
        } else {
          repo.removeFromIndex(relPath);
        }
      }
      return ok("");
    }
    const targetRef = paths[0] ?? "HEAD";
    const targetHash = repo.resolveRef(targetRef) ?? repo.resolveHEAD();
    if (!targetHash) return fail("fatal: Failed to resolve HEAD\n", 128);
    if (!soft) {
      const tree = repo.getCommitTree(targetHash);
      const newIndex = [];
      for (const [path, blobHash] of tree) {
        newIndex.push({
          path,
          hash: blobHash,
          mode: 100644,
          mtime: Date.now()
        });
      }
      newIndex.sort((a, b) => a.path.localeCompare(b.path));
      repo.writeIndex(newIndex);
    }
    if (hard) {
      const tree = repo.getCommitTree(targetHash);
      for (const [path, blobHash] of tree) {
        const content = repo.getBlobContent(blobHash);
        if (content !== null) {
          const fullPath = repo.workDir + "/" + path;
          const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
          if (dir && !ctx.volume.existsSync(dir)) ctx.volume.mkdirSync(dir, {
            recursive: true
          });
          ctx.volume.writeFileSync(fullPath, content);
        }
      }
    }
    const branch = repo.getCurrentBranch();
    if (branch) repo.updateBranchRef(branch, targetHash);
    return ok(`HEAD is now at ${targetHash.slice(0, 7)}
`);
  }
  function requireToken(env) {
    return env.GITHUB_TOKEN || env.GH_TOKEN || null;
  }
  async function gitClone(args, ctx) {
    var _a;
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    const url = nonFlags[0];
    if (!url) return fail("usage: git clone <repository> [<directory>]\n");
    let branch = "main";
    const bIdx = args.indexOf("-b");
    if (bIdx >= 0 && args[bIdx + 1]) branch = args[bIdx + 1];
    const tmpRepo = new GitRepo(ctx.volume, "/", "/");
    const gh = tmpRepo.parseGitHubUrl(url);
    if (!gh) {
      return fail(`fatal: repository '${url}' is not a GitHub URL
`, 128);
    }
    const token = requireToken(ctx.env);
    if (!token) {
      return fail("fatal: authentication required. Set GITHUB_TOKEN environment variable.\n", 128);
    }
    let targetDir = nonFlags[1] ?? gh.repo;
    if (!targetDir.startsWith("/")) targetDir = resolve(ctx.cwd, targetDir);
    const repoInfo = await githubApi(`/repos/${gh.owner}/${gh.repo}`, token);
    if (!repoInfo.ok) {
      if (repoInfo.status === 404) return fail(`fatal: repository '${url}' not found
`, 128);
      return fail(`fatal: GitHub API error: ${repoInfo.status} ${((_a = repoInfo.data) == null ? void 0 : _a.message) ?? ""}
`, 128);
    }
    const defaultBranch = repoInfo.data.default_branch ?? "main";
    if (branch === "main" && defaultBranch !== "main") branch = defaultBranch;
    const refResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/ref/heads/${branch}`, token);
    if (!refResp.ok) {
      return fail(`fatal: Remote branch '${branch}' not found
`, 128);
    }
    const commitSha = refResp.data.object.sha;
    const commitResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/commits/${commitSha}`, token);
    if (!commitResp.ok) return fail(`fatal: could not fetch commit
`, 128);
    const treeSha = commitResp.data.tree.sha;
    const treeResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/trees/${treeSha}?recursive=1`, token);
    if (!treeResp.ok) return fail(`fatal: could not fetch tree
`, 128);
    if (!ctx.volume.existsSync(targetDir)) ctx.volume.mkdirSync(targetDir, {
      recursive: true
    });
    let fileCount = 0;
    const blobs = [];
    for (const item of treeResp.data.tree) {
      if (item.type === "blob") {
        blobs.push({
          path: item.path,
          sha: item.sha
        });
      }
    }
    const BATCH_SIZE = 10;
    for (let i = 0; i < blobs.length; i += BATCH_SIZE) {
      const batch = blobs.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map((b) => githubApi(`/repos/${gh.owner}/${gh.repo}/git/blobs/${b.sha}`, token)));
      for (let j = 0; j < batch.length; j++) {
        const blobResp = results[j];
        if (!blobResp.ok) continue;
        const filePath = targetDir + "/" + batch[j].path;
        const dir = filePath.substring(0, filePath.lastIndexOf("/"));
        if (dir && !ctx.volume.existsSync(dir)) ctx.volume.mkdirSync(dir, {
          recursive: true
        });
        let content;
        if (blobResp.data.encoding === "base64") {
          content = atob(blobResp.data.content.replace(/\n/g, ""));
        } else {
          content = blobResp.data.content;
        }
        ctx.volume.writeFileSync(filePath, content);
        fileCount++;
      }
    }
    gitInit([], {
      ...ctx,
      cwd: targetDir
    });
    const clonedRepo = new GitRepo(ctx.volume, targetDir, targetDir + "/.git");
    clonedRepo.setConfigValue("remote.origin.url", url);
    clonedRepo.setConfigValue("remote.origin.fetch", "+refs/heads/*:refs/remotes/origin/*");
    clonedRepo.setConfigValue("branch." + branch + ".remote", "origin");
    clonedRepo.setConfigValue("branch." + branch + ".merge", "refs/heads/" + branch);
    clonedRepo.setHEAD("ref: refs/heads/" + branch);
    clonedRepo.walkWorkTree(targetDir, "", (relPath, content) => {
      clonedRepo.addToIndex(relPath, content);
    });
    const entries = clonedRepo.readIndex();
    const treeHash = clonedRepo.buildTree(entries);
    const cloneCommitHash = clonedRepo.createCommit(`Clone of ${url}`, null, treeHash);
    clonedRepo.updateBranchRef(branch, cloneCommitHash);
    return ok(`Cloning into '${nonFlags[1] ?? gh.repo}'...
remote: Enumerating objects: ${fileCount}
Receiving objects: 100% (${fileCount}/${fileCount}), done.
`);
  }
  async function gitPush(args, ctx) {
    var _a, _b, _c, _d, _e;
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const token = requireToken(ctx.env);
    if (!token) return fail("fatal: authentication required. Set GITHUB_TOKEN environment variable.\n", 128);
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    const remoteName = nonFlags[0] ?? "origin";
    const localBranch = repo.getCurrentBranch();
    if (!localBranch) return fail("fatal: not on a branch\n", 128);
    const remoteBranch = nonFlags[1] ?? localBranch;
    const remoteUrl = repo.getRemoteUrl(remoteName);
    if (!remoteUrl) return fail(`fatal: '${remoteName}' does not appear to be a git repository
`, 128);
    const gh = repo.parseGitHubUrl(remoteUrl);
    if (!gh) return fail(`fatal: remote '${remoteName}' is not a GitHub URL
`, 128);
    const headHash = repo.resolveHEAD();
    if (!headHash) return fail("fatal: nothing to push\n", 128);
    const commitTree = repo.getCommitTree(headHash);
    const blobShas = /* @__PURE__ */ new Map();
    for (const [path, localHash] of commitTree) {
      const content = repo.getBlobContent(localHash);
      if (content === null) continue;
      const blobResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/blobs`, token, "POST", {
        content: btoa(content),
        encoding: "base64"
      });
      if (!blobResp.ok) return fail(`fatal: failed to create blob for ${path}: ${(_a = blobResp.data) == null ? void 0 : _a.message}
`, 128);
      blobShas.set(path, blobResp.data.sha);
    }
    const treeEntries = Array.from(blobShas).map(([path, sha]) => ({
      path,
      mode: "100644",
      type: "blob",
      sha
    }));
    const treeResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/trees`, token, "POST", {
      tree: treeEntries
    });
    if (!treeResp.ok) return fail(`fatal: failed to create tree: ${(_b = treeResp.data) == null ? void 0 : _b.message}
`, 128);
    let parentSha = null;
    const refResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/ref/heads/${remoteBranch}`, token);
    if (refResp.ok) parentSha = refResp.data.object.sha;
    const commit = repo.readCommit(headHash);
    const commitBody = {
      message: (commit == null ? void 0 : commit.message) ?? "Push from nodepod",
      tree: treeResp.data.sha
    };
    if (parentSha) commitBody.parents = [
      parentSha
    ];
    const commitResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/commits`, token, "POST", commitBody);
    if (!commitResp.ok) return fail(`fatal: failed to create commit: ${(_c = commitResp.data) == null ? void 0 : _c.message}
`, 128);
    if (parentSha) {
      const force = args.includes("-f") || args.includes("--force");
      const updateResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/refs/heads/${remoteBranch}`, token, "PATCH", {
        sha: commitResp.data.sha,
        force
      });
      if (!updateResp.ok) return fail(`fatal: failed to update ref: ${(_d = updateResp.data) == null ? void 0 : _d.message}
`, 128);
    } else {
      const createResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/refs`, token, "POST", {
        ref: `refs/heads/${remoteBranch}`,
        sha: commitResp.data.sha
      });
      if (!createResp.ok) return fail(`fatal: failed to create ref: ${(_e = createResp.data) == null ? void 0 : _e.message}
`, 128);
    }
    return ok(`To ${remoteUrl}
   ${(parentSha ?? "000000").slice(0, 7)}..${commitResp.data.sha.slice(0, 7)}  ${localBranch} -> ${remoteBranch}
`);
  }
  async function gitPull(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const token = requireToken(ctx.env);
    if (!token) return fail("fatal: authentication required. Set GITHUB_TOKEN environment variable.\n", 128);
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    const remoteName = nonFlags[0] ?? "origin";
    const currentBranch = repo.getCurrentBranch();
    if (!currentBranch) return fail("fatal: not on a branch\n", 128);
    const remoteBranch = nonFlags[1] ?? currentBranch;
    const remoteUrl = repo.getRemoteUrl(remoteName);
    if (!remoteUrl) return fail(`fatal: '${remoteName}' does not appear to be a git repository
`, 128);
    const gh = repo.parseGitHubUrl(remoteUrl);
    if (!gh) return fail(`fatal: remote '${remoteName}' is not a GitHub URL
`, 128);
    const refResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/ref/heads/${remoteBranch}`, token);
    if (!refResp.ok) return fail(`fatal: couldn't find remote ref refs/heads/${remoteBranch}
`, 128);
    const remoteCommitSha = refResp.data.object.sha;
    const localHead = repo.resolveHEAD();
    if (localHead === remoteCommitSha) return ok("Already up to date.\n");
    const commitResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/commits/${remoteCommitSha}`, token);
    if (!commitResp.ok) return fail("fatal: could not fetch remote commit\n", 128);
    const treeSha = commitResp.data.tree.sha;
    const treeResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/git/trees/${treeSha}?recursive=1`, token);
    if (!treeResp.ok) return fail("fatal: could not fetch tree\n", 128);
    let updated = 0;
    const blobs = [];
    for (const item of treeResp.data.tree) {
      if (item.type === "blob") blobs.push({
        path: item.path,
        sha: item.sha
      });
    }
    const BATCH_SIZE = 10;
    for (let i = 0; i < blobs.length; i += BATCH_SIZE) {
      const batch = blobs.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map((b) => githubApi(`/repos/${gh.owner}/${gh.repo}/git/blobs/${b.sha}`, token)));
      for (let j = 0; j < batch.length; j++) {
        const blobResp = results[j];
        if (!blobResp.ok) continue;
        const filePath = repo.workDir + "/" + batch[j].path;
        const dir = filePath.substring(0, filePath.lastIndexOf("/"));
        if (dir && !ctx.volume.existsSync(dir)) ctx.volume.mkdirSync(dir, {
          recursive: true
        });
        let content;
        if (blobResp.data.encoding === "base64") {
          content = atob(blobResp.data.content.replace(/\n/g, ""));
        } else {
          content = blobResp.data.content;
        }
        ctx.volume.writeFileSync(filePath, content);
        updated++;
      }
    }
    repo.walkWorkTree(repo.workDir, "", (relPath, content) => {
      repo.addToIndex(relPath, content);
    });
    const entries = repo.readIndex();
    const treeHash = repo.buildTree(entries);
    const pullCommit = repo.createCommit(`Pull from ${remoteName}/${remoteBranch}`, localHead, treeHash);
    repo.updateBranchRef(currentBranch, pullCommit);
    return ok(`From ${remoteUrl}
Updating ${(localHead ?? "000000").slice(0, 7)}..${remoteCommitSha.slice(0, 7)}
Fast-forward
 ${updated} file${updated !== 1 ? "s" : ""} changed
`);
  }
  async function gitFetch(args, ctx) {
    const r = requireRepo(ctx.volume, ctx.cwd);
    if ("error" in r) return r.error;
    const { repo } = r;
    const token = requireToken(ctx.env);
    if (!token) return fail("fatal: authentication required. Set GITHUB_TOKEN environment variable.\n", 128);
    const nonFlags = args.filter((a) => !a.startsWith("-"));
    const remoteName = nonFlags[0] ?? "origin";
    const remoteUrl = repo.getRemoteUrl(remoteName);
    if (!remoteUrl) return fail(`fatal: '${remoteName}' does not appear to be a git repository
`, 128);
    const gh = repo.parseGitHubUrl(remoteUrl);
    if (!gh) return fail(`fatal: remote '${remoteName}' is not a GitHub URL
`, 128);
    const branchesResp = await githubApi(`/repos/${gh.owner}/${gh.repo}/branches`, token);
    if (!branchesResp.ok) return fail(`fatal: could not list remote branches
`, 128);
    let out = `From ${remoteUrl}
`;
    for (const b of branchesResp.data) {
      const refPath = repo.gitDir + "/refs/remotes/" + remoteName + "/" + b.name;
      const dir = refPath.substring(0, refPath.lastIndexOf("/"));
      if (!ctx.volume.existsSync(dir)) ctx.volume.mkdirSync(dir, {
        recursive: true
      });
      ctx.volume.writeFileSync(refPath, b.commit.sha + "\n");
      out += ` * [updated]    ${b.name} -> ${remoteName}/${b.name}
`;
    }
    return ok(out);
  }
  function createGitCommand() {
    return {
      name: "git",
      async execute(args, ctx) {
        if (args.length === 0) {
          return ok(`usage: git [--version] <command> [<args>]
`);
        }
        let effectiveCtx = ctx;
        if (args[0] === "-C" && args[1]) {
          const newCwd = resolve(ctx.cwd, args[1]);
          effectiveCtx = {
            ...ctx,
            cwd: newCwd
          };
          args = args.slice(2);
        }
        const sub = args[0];
        const subArgs = args.slice(1);
        switch (sub) {
          case "--version":
          case "-v":
            return ok(`git version ${VERSIONS.GIT}
`);
          case "--help":
          case "help":
            return ok(`usage: git <command> [<args>]

Available commands:
  init       Create an empty Git repository
  clone      Clone a repository from GitHub
  add        Add file contents to the index
  status     Show the working tree status
  commit     Record changes to the repository
  log        Show commit logs
  diff       Show changes
  branch     List, create, or delete branches
  checkout   Switch branches or restore files
  switch     Switch branches
  merge      Join two development histories together
  remote     Manage set of tracked repositories
  push       Update remote refs (GitHub)
  pull       Fetch and integrate remote changes (GitHub)
  fetch      Download objects from remote (GitHub)
  stash      Stash the changes in a dirty working directory
  reset      Reset current HEAD to the specified state
  rm         Remove files from the working tree and index
  rev-parse  Ancillary plumbing command
  config     Get and set repository options
`);
          case "init":
            return gitInit(subArgs, effectiveCtx);
          case "clone":
            return gitClone(subArgs, effectiveCtx);
          case "add":
            return gitAdd(subArgs, effectiveCtx);
          case "status":
            return gitStatus(subArgs, effectiveCtx);
          case "commit":
            return gitCommit(subArgs, effectiveCtx);
          case "log":
            return gitLog(subArgs, effectiveCtx);
          case "diff":
            return gitDiff(subArgs, effectiveCtx);
          case "branch":
            return gitBranch(subArgs, effectiveCtx);
          case "checkout":
            return gitCheckout(subArgs, effectiveCtx);
          case "switch":
            return gitSwitch(subArgs, effectiveCtx);
          case "merge":
            return gitMerge(subArgs, effectiveCtx);
          case "remote":
            return gitRemote(subArgs, effectiveCtx);
          case "push":
            return gitPush(subArgs, effectiveCtx);
          case "pull":
            return gitPull(subArgs, effectiveCtx);
          case "fetch":
            return gitFetch(subArgs, effectiveCtx);
          case "stash":
            return gitStash(subArgs, effectiveCtx);
          case "reset":
            return gitReset(subArgs, effectiveCtx);
          case "rm":
            return gitRm(subArgs, effectiveCtx);
          case "rev-parse":
            return gitRevParse(subArgs, effectiveCtx);
          case "config":
            return gitConfig(subArgs, effectiveCtx);
          default:
            return fail(`git: '${sub}' is not a git command. See 'git --help'.
`);
        }
      }
    };
  }
  let _shell = null;
  let _vol = null;
  let _syncChannel = null;
  let _stdoutSink = null;
  let _stderrSink = null;
  let _haltSignal = null;
  let _termCols = null;
  let _termRows = null;
  let _rawModeChangeCb = null;
  function getStdoutSink() {
    const ctx = getActiveContext();
    return (ctx == null ? void 0 : ctx.stdoutSink) ?? _stdoutSink;
  }
  function getStderrSink() {
    const ctx = getActiveContext();
    return (ctx == null ? void 0 : ctx.stderrSink) ?? _stderrSink;
  }
  function getHaltSignal() {
    const ctx = getActiveContext();
    return ctx ? ctx.abortController.signal : _haltSignal;
  }
  function getLiveStdin() {
    const ctx = getActiveContext();
    return (ctx == null ? void 0 : ctx.liveStdin) ?? _liveStdin;
  }
  function getTermCols() {
    var _a;
    const ctx = getActiveContext();
    return ((_a = ctx == null ? void 0 : ctx.termCols) == null ? void 0 : _a.call(ctx)) ?? (_termCols == null ? void 0 : _termCols()) ?? 80;
  }
  function getTermRows() {
    var _a;
    const ctx = getActiveContext();
    return ((_a = ctx == null ? void 0 : ctx.termRows) == null ? void 0 : _a.call(ctx)) ?? (_termRows == null ? void 0 : _termRows()) ?? 24;
  }
  function formatThrown(e) {
    var _a;
    if (e instanceof Error) {
      const prefix = ((_a = e.constructor) == null ? void 0 : _a.name) && e.constructor.name !== "Error" ? `${e.constructor.name}: ` : "";
      let msg = prefix + (e.message || e.name || "Unknown error");
      if (e.stack) msg += "\n" + e.stack;
      return msg;
    }
    if (e === null || e === void 0) return "Script threw a falsy value";
    return String(e) || "Unknown error (non-Error object thrown)";
  }
  setStreamingCallbacks = function(cfg) {
    _stdoutSink = cfg.onStdout ?? null;
    _stderrSink = cfg.onStderr ?? null;
    _haltSignal = cfg.signal ?? null;
    _termCols = cfg.getCols ?? null;
    _termRows = cfg.getRows ?? null;
    _rawModeChangeCb = cfg.onRawModeChange ?? null;
    const ctx = getActiveContext();
    if (ctx) {
      ctx.stdoutSink = cfg.onStdout ?? null;
      ctx.stderrSink = cfg.onStderr ?? null;
      if (cfg.signal) {
        cfg.signal.addEventListener("abort", () => ctx.abortController.abort(), {
          once: true
        });
      }
      ctx.termCols = cfg.getCols ?? null;
      ctx.termRows = cfg.getRows ?? null;
    }
  };
  clearStreamingCallbacks = function() {
    _stdoutSink = null;
    _stderrSink = null;
    _haltSignal = null;
    _termCols = null;
    _termRows = null;
    _rawModeChangeCb = null;
    const ctx = getActiveContext();
    if (ctx) {
      ctx.stdoutSink = null;
      ctx.stderrSink = null;
      ctx.termCols = null;
      ctx.termRows = null;
    }
  };
  setSyncChannel = function(channel) {
    _syncChannel = channel;
  };
  let _spawnChildFn = null;
  setSpawnChildCallback = function(fn) {
    _spawnChildFn = fn;
  };
  let _forkChildFn = null;
  setForkChildCallback = function(fn) {
    _forkChildFn = fn;
  };
  let _ipcSendFn = null;
  let _ipcReceiveHandler = null;
  let _ipcQueue = [];
  setIPCSend = function(fn) {
    _ipcSendFn = fn;
  };
  setIPCReceiveHandler = function(fn) {
    _ipcReceiveHandler = fn;
    if (_ipcQueue.length > 0) {
      const queued = _ipcQueue;
      _ipcQueue = [];
      for (const msg of queued) fn(msg);
    }
  };
  handleIPCFromParent = function(data) {
    if (_ipcReceiveHandler) {
      _ipcReceiveHandler(data);
    } else {
      _ipcQueue.push(data);
    }
  };
  getShellCwd = function() {
    return (_shell == null ? void 0 : _shell.getCwd()) ?? "/";
  };
  setShellCwd = function(dir) {
    if (_shell) _shell.setCwd(dir);
  };
  shellExec = function(cmd, opts, callback) {
    if (!_shell) {
      callback(new Error("[Nodepod] Shell not initialized"), "", "");
      return;
    }
    _shell.exec(cmd, opts).then((result) => {
      if (result.exitCode !== 0) {
        const e = new Error(`Command failed: ${cmd}`);
        e.code = result.exitCode;
        callback(e, result.stdout, result.stderr);
      } else {
        callback(null, result.stdout, result.stderr);
      }
    }, (e) => {
      callback(e instanceof Error ? e : new Error(String(e)), "", "");
    });
  };
  let _liveStdin = null;
  isStdinRaw = function() {
    const stdin = getLiveStdin();
    if (!stdin) return false;
    return !!stdin.isRaw;
  };
  sendStdin = function(text) {
    const stdin = getLiveStdin();
    if (!stdin) {
      return;
    }
    stdin.emit("data", text);
  };
  initShellExec = function(volume, opts) {
    _vol = volume;
    _shell = new NodepodShell(volume, {
      cwd: (opts == null ? void 0 : opts.cwd) ?? "/",
      env: {
        HOME: "/home/user",
        USER: "user",
        PATH: "/usr/local/bin:/usr/bin:/bin:/node_modules/.bin",
        NODE_ENV: "development",
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
        npm_config_user_agent: DEFAULT_ENV.npm_config_user_agent,
        npm_execpath: DEFAULT_ENV.npm_execpath,
        npm_node_execpath: DEFAULT_ENV.npm_node_execpath,
        ...opts == null ? void 0 : opts.env
      }
    });
    const pmDeps = {
      installPackages,
      uninstallPackages,
      listPackages,
      runScript,
      npmInitOrCreate,
      npmInfo,
      npmPack,
      npmConfig,
      npxExecute,
      executeNodeBinary,
      evalCode: (code, ctx) => evalNodeCode(code, ctx),
      printCode: (code, ctx) => printNodeCode(code, ctx),
      removeNodeModules: (cwd) => {
        const dir = `${cwd}/node_modules`.replace(/\/+/g, "/");
        if (_vol.existsSync(dir)) removeDir(_vol, dir);
      },
      formatErr,
      formatWarn,
      hasFile: (p) => !!_vol && _vol.existsSync(p),
      readFile: (p) => _vol.readFileSync(p, "utf8"),
      writeFile: (p, data) => _vol.writeFileSync(p, data)
    };
    _shell.registerCommand(createNodeCommand(pmDeps));
    _shell.registerCommand(createNpxCommand(pmDeps));
    _shell.registerCommand(createNpmCommand(pmDeps));
    _shell.registerCommand(createPnpmCommand(pmDeps));
    _shell.registerCommand(createYarnCommand(pmDeps));
    _shell.registerCommand(createBunCommand(pmDeps));
    _shell.registerCommand(createBunxCommand(pmDeps));
    _shell.registerCommand(createGitCommand());
  };
  function evalNodeCode(code, ctx) {
    let out = "";
    let err = "";
    const sandbox = new ScriptEngine(_vol, {
      cwd: ctx.cwd,
      env: ctx.env,
      onConsole: (m, args) => {
        const line = format(args[0], ...args.slice(1)) + "\n";
        m === "error" ? err += line : out += line;
      },
      onStdout: (s) => {
        out += s;
      },
      onStderr: (s) => {
        err += s;
      }
    });
    try {
      sandbox.execute(code, "/<eval>.js");
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("Process exited with code")) return {
        stdout: out,
        stderr: err,
        exitCode: 0
      };
      err += `Error: ${e instanceof Error ? e.message : String(e)}
`;
      return {
        stdout: out,
        stderr: err,
        exitCode: 1
      };
    }
    return {
      stdout: out,
      stderr: err,
      exitCode: 0
    };
  }
  function printNodeCode(code, ctx) {
    let out = "";
    let err = "";
    const sandbox = new ScriptEngine(_vol, {
      cwd: ctx.cwd,
      env: ctx.env,
      onConsole: (m, args) => {
        const line = format(args[0], ...args.slice(1)) + "\n";
        m === "error" ? err += line : out += line;
      },
      onStdout: (s) => {
        out += s;
      },
      onStderr: (s) => {
        err += s;
      }
    });
    try {
      const result = sandbox.execute(code, "/<print>.js");
      out += String(result.exports) + "\n";
    } catch (e) {
      err += `Error: ${e instanceof Error ? e.message : String(e)}
`;
      return {
        stdout: out,
        stderr: err,
        exitCode: 1
      };
    }
    return {
      stdout: out,
      stderr: err,
      exitCode: 0
    };
  }
  function removeDir(vol, dir) {
    for (const name of vol.readdirSync(dir)) {
      const full = `${dir}/${name}`;
      const st = vol.statSync(full);
      if (st.isDirectory()) removeDir(vol, full);
      else vol.unlinkSync(full);
    }
    vol.rmdirSync(dir);
  }
  function loadManifest(cwd) {
    const p = `${cwd}/package.json`.replace(/\/+/g, "/");
    if (!_vol.existsSync(p)) return {
      fail: {
        stdout: "",
        stderr: formatErr("package.json not found", "npm"),
        exitCode: 1
      }
    };
    try {
      return {
        pkg: JSON.parse(_vol.readFileSync(p, "utf8"))
      };
    } catch {
      return {
        fail: {
          stdout: "",
          stderr: formatErr("Malformed package.json", "npm"),
          exitCode: 1
        }
      };
    }
  }
  async function runScript(args, ctx) {
    const name = args[0];
    if (!name) {
      const r2 = loadManifest(ctx.cwd);
      if ("fail" in r2) return r2.fail;
      const scripts2 = r2.pkg.scripts ?? {};
      const keys = Object.keys(scripts2);
      if (keys.length === 0) return {
        stdout: "",
        stderr: "",
        exitCode: 0
      };
      let text = `Scripts in ${r2.pkg.name ?? ""}:
`;
      for (const k of keys) text += `  ${k}
    ${scripts2[k]}
`;
      return {
        stdout: text,
        stderr: "",
        exitCode: 0
      };
    }
    const dashIdx = args.indexOf("--");
    const extraArgs = dashIdx >= 0 ? args.slice(dashIdx + 1) : [];
    const r = loadManifest(ctx.cwd);
    if ("fail" in r) return r.fail;
    const scripts = r.pkg.scripts ?? {};
    let cmd = scripts[name];
    if (!cmd) {
      let msg = formatErr(`Missing script: "${name}"`, "npm");
      const avail = Object.keys(scripts);
      if (avail.length) {
        msg += "\nAvailable:\n";
        for (const s of avail) msg += `  ${A_CYAN}${s}${A_RESET}: ${A_DIM}${scripts[s]}${A_RESET}
`;
      }
      return {
        stdout: "",
        stderr: msg,
        exitCode: 1
      };
    }
    if (extraArgs.length > 0) {
      cmd += " " + extraArgs.map((a) => a.includes(" ") ? `"${a}"` : a).join(" ");
    }
    const binDir = `${ctx.cwd}/node_modules/.bin`.replace(/\/+/g, "/");
    const existingPath = ctx.env.PATH || "";
    const pathWithBin = existingPath.includes(binDir) ? existingPath : `${binDir}:${existingPath}`;
    const env = {
      ...ctx.env,
      PATH: pathWithBin,
      npm_lifecycle_event: name
    };
    if (r.pkg.name) env.npm_package_name = r.pkg.name;
    if (r.pkg.version) env.npm_package_version = r.pkg.version;
    let allOut = "";
    let allErr = "";
    const label = `${r.pkg.name ?? ""}@${r.pkg.version ?? ""}`;
    const pre = scripts[`pre${name}`];
    if (pre) {
      const hdr = `
> ${label} pre${name}
> ${pre}

`;
      allErr += hdr;
      if (_stderrSink) _stderrSink(hdr);
      const pr = await ctx.exec(pre, {
        cwd: ctx.cwd,
        env
      });
      allOut += pr.stdout;
      allErr += pr.stderr;
      if (pr.exitCode !== 0) return {
        stdout: allOut,
        stderr: allErr,
        exitCode: pr.exitCode
      };
    }
    const mainHdr = `
> ${label} ${name}
> ${cmd}

`;
    allErr += mainHdr;
    if (_stderrSink) _stderrSink(mainHdr);
    const mr = await ctx.exec(cmd, {
      cwd: ctx.cwd,
      env
    });
    allOut += mr.stdout;
    allErr += mr.stderr;
    if (mr.exitCode !== 0) return {
      stdout: allOut,
      stderr: allErr,
      exitCode: mr.exitCode
    };
    const post = scripts[`post${name}`];
    if (post) {
      const hdr = `
> ${label} post${name}
> ${post}

`;
      allErr += hdr;
      if (_stderrSink) _stderrSink(hdr);
      const po = await ctx.exec(post, {
        cwd: ctx.cwd,
        env
      });
      allOut += po.stdout;
      allErr += po.stderr;
      if (po.exitCode !== 0) return {
        stdout: allOut,
        stderr: allErr,
        exitCode: po.exitCode
      };
    }
    return {
      stdout: allOut,
      stderr: allErr,
      exitCode: 0
    };
  }
  const A_RESET = "\x1B[0m";
  const A_BOLD = "\x1B[1m";
  const A_DIM = "\x1B[2m";
  const A_RED = "\x1B[31m";
  const A_GREEN = "\x1B[32m";
  const A_YELLOW = "\x1B[33m";
  const A_BLUE = "\x1B[34m";
  const A_CYAN = "\x1B[36m";
  const A_WHITE = "\x1B[37m";
  const ERASE_LINE = "\x1B[2K";
  const SPINNER_FRAMES = [
    "\u280B",
    "\u2819",
    "\u2839",
    "\u2838",
    "\u283C",
    "\u2834",
    "\u2826",
    "\u2827",
    "\u2807",
    "\u280F"
  ];
  function createSpinner(text, writeFn) {
    let frame = 0;
    let current = text;
    const id = setInterval(() => {
      writeFn(`${ERASE_LINE}\r${A_CYAN}${SPINNER_FRAMES[frame]}${A_RESET} ${current}`);
      frame = (frame + 1) % SPINNER_FRAMES.length;
    }, 80);
    return {
      update(t) {
        current = t;
      },
      succeed(t) {
        clearInterval(id);
        writeFn(`${ERASE_LINE}\r${A_GREEN}\u2714${A_RESET} ${t}
`);
      },
      fail(t) {
        clearInterval(id);
        writeFn(`${ERASE_LINE}\r${A_RED}\u2716${A_RESET} ${t}
`);
      },
      stop() {
        clearInterval(id);
      }
    };
  }
  const PM_COLORS = {
    npm: A_RED,
    pnpm: A_YELLOW,
    yarn: A_BLUE,
    bun: A_WHITE
  };
  function formatProgress(msg, pm = "npm") {
    const accent = PM_COLORS[pm];
    const resolving = msg.match(/^Resolving\s+(.+?)\.{3}$/);
    if (resolving) return `${A_DIM}Resolving${A_RESET} ${accent}${resolving[1]}${A_RESET}${A_DIM}...${A_RESET}`;
    const downloading = msg.match(/^Downloading\s+(\d+)\s+package/);
    if (downloading) return `${A_DIM}Downloading${A_RESET} ${A_YELLOW}${downloading[1]}${A_RESET} ${A_DIM}packages...${A_RESET}`;
    const fetching = msg.match(/^(?:\s*)?Fetching\s+(.+?)\.{3}$/);
    if (fetching) return `${A_DIM}Fetching${A_RESET} ${accent}${fetching[1]}${A_RESET}${A_DIM}...${A_RESET}`;
    const transformed = msg.match(/^(?:\s*)?Transformed\s+(\d+)\s+file/);
    if (transformed) return `${A_DIM}${msg.trim()}${A_RESET}`;
    const installed = msg.match(/^Installed\s+(\d+)/);
    if (installed) return `${A_GREEN}${msg}${A_RESET}`;
    const skipping = msg.match(/^Skipping\s+(.+?)\s+\(up to date\)$/);
    if (skipping) return `${A_DIM}Skipping${A_RESET} ${accent}${skipping[1]}${A_RESET} ${A_DIM}(up to date)${A_RESET}`;
    return msg;
  }
  function formatInstallSummary(totalAdded, elapsed, pm) {
    const pkgs = `${totalAdded} package${totalAdded !== 1 ? "s" : ""}`;
    switch (pm) {
      case "npm":
        return `${A_BOLD}added ${pkgs}${A_RESET} ${A_DIM}in ${elapsed}s${A_RESET}`;
      case "pnpm":
        return `${A_BOLD}packages:${A_RESET} ${A_GREEN}+${totalAdded}${A_RESET}
${A_DIM}Done in ${elapsed}s${A_RESET}`;
      case "yarn":
        return `${A_BOLD}${pkgs} added${A_RESET} ${A_DIM}in ${elapsed}s${A_RESET}`;
      case "bun":
        return `${A_BOLD}${pkgs} installed${A_RESET} ${A_DIM}[${elapsed}s]${A_RESET}`;
    }
  }
  function formatErr(msg, pm) {
    switch (pm) {
      case "npm":
        return `${A_RED}npm ERR!${A_RESET} ${msg}
`;
      case "pnpm":
        return `${A_RED} ERR_PNPM${A_RESET}  ${msg}
`;
      case "yarn":
        return `${A_RED}error${A_RESET} ${msg}
`;
      case "bun":
        return `${A_RED}error:${A_RESET} ${msg}
`;
    }
  }
  function formatWarn(msg, pm) {
    switch (pm) {
      case "npm":
        return `${A_YELLOW}npm WARN${A_RESET} ${msg}
`;
      case "pnpm":
        return `${A_YELLOW} WARN${A_RESET}  ${msg}
`;
      case "yarn":
        return `${A_YELLOW}warning${A_RESET} ${msg}
`;
      case "bun":
        return `${A_YELLOW}warn:${A_RESET} ${msg}
`;
    }
  }
  async function installPackages(args, ctx, pm = "npm") {
    const { DependencyInstaller } = await import("./index-DdYRf9qZ.js").then(async (m) => {
      await m.__tla;
      return m;
    }).then((n) => n.ag);
    const installer = new DependencyInstaller(_vol, {
      cwd: ctx.cwd
    });
    let out = "";
    const write = _stdoutSink ?? ((_s) => {
    });
    const startTime = Date.now();
    const spinnerText = pm === "bun" ? `${A_DIM}bun install${A_RESET} ${A_DIM}${VERSIONS.BUN_V}${A_RESET}` : `${A_DIM}Resolving dependencies...${A_RESET}`;
    const spinner = createSpinner(spinnerText, write);
    try {
      const names = args.filter((a) => !a.startsWith("-"));
      const onProgress = (m) => {
        const colored = formatProgress(m, pm);
        out += m + "\n";
        spinner.update(colored);
      };
      let totalAdded = 0;
      if (names.length === 0) {
        const ir = await installer.installFromManifest(void 0, {
          withDevDeps: true,
          onProgress
        });
        totalAdded = ir.newPackages.length;
      } else {
        for (const n of names) {
          const ir = await installer.install(n, void 0, {
            onProgress
          });
          totalAdded += ir.newPackages.length;
        }
      }
      const elapsed = ((Date.now() - startTime) / 1e3).toFixed(1);
      const summary = formatInstallSummary(totalAdded, elapsed, pm);
      spinner.succeed(summary);
      out += `added ${totalAdded} packages in ${elapsed}s
`;
      return {
        stdout: out,
        stderr: "",
        exitCode: 0
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      spinner.fail(`${A_RED}${msg}${A_RESET}`);
      return {
        stdout: out,
        stderr: formatErr(msg, pm),
        exitCode: 1
      };
    }
  }
  async function uninstallPackages(args, ctx, pm = "npm") {
    var _a, _b;
    const names = args.filter((a) => !a.startsWith("-"));
    if (names.length === 0) return {
      stdout: "",
      stderr: formatErr("Must specify package to remove", pm),
      exitCode: 1
    };
    const write = _stdoutSink ?? ((_s) => {
    });
    let out = "";
    for (const name of names) {
      const pkgDir = `${ctx.cwd}/node_modules/${name}`.replace(/\/+/g, "/");
      if (_vol.existsSync(pkgDir)) {
        try {
          removeDir(_vol, pkgDir);
          const msg = pm === "bun" ? `${A_DIM}-${A_RESET} ${name}` : pm === "pnpm" ? `${A_RED}-${A_RESET} ${name}` : `removed ${name}`;
          out += msg + "\n";
          write(msg + "\n");
        } catch (e) {
          return {
            stdout: out,
            stderr: formatErr(`Failed to remove ${name}: ${e instanceof Error ? e.message : String(e)}`, pm),
            exitCode: 1
          };
        }
      } else {
        out += formatWarn(`${name} not installed`, pm);
      }
      const r = loadManifest(ctx.cwd);
      if (!("fail" in r)) {
        const pkg = r.pkg;
        let changed = false;
        if ((_a = pkg.dependencies) == null ? void 0 : _a[name]) {
          delete pkg.dependencies[name];
          changed = true;
        }
        if ((_b = pkg.devDependencies) == null ? void 0 : _b[name]) {
          delete pkg.devDependencies[name];
          changed = true;
        }
        if (changed) {
          const p = `${ctx.cwd}/package.json`.replace(/\/+/g, "/");
          _vol.writeFileSync(p, JSON.stringify(pkg, null, 2));
        }
      }
    }
    return {
      stdout: out,
      stderr: "",
      exitCode: 0
    };
  }
  async function listPackages(ctx, pm = "npm") {
    const { DependencyInstaller } = await import("./index-DdYRf9qZ.js").then(async (m) => {
      await m.__tla;
      return m;
    }).then((n) => n.ag);
    const installer = new DependencyInstaller(_vol, {
      cwd: ctx.cwd
    });
    const pkgs = installer.listInstalled();
    const entries = Object.entries(pkgs);
    if (entries.length === 0) return {
      stdout: `${A_DIM}(empty)${A_RESET}
`,
      stderr: "",
      exitCode: 0
    };
    const r = loadManifest(ctx.cwd);
    const label = !("fail" in r) ? `${r.pkg.name ?? "project"}@${r.pkg.version ?? "0.0.0"}` : ctx.cwd;
    let text = "";
    switch (pm) {
      case "npm":
        text += `${label} ${ctx.cwd}
`;
        for (let i = 0; i < entries.length; i++) {
          const [n, v] = entries[i];
          const isLast = i === entries.length - 1;
          text += `${isLast ? "\u2514\u2500\u2500" : "\u251C\u2500\u2500"} ${n}@${A_DIM}${v}${A_RESET}
`;
        }
        break;
      case "pnpm":
        text += `${A_DIM}Legend: production dependency, optional only, dev only${A_RESET}

`;
        text += `${label} ${ctx.cwd}

`;
        text += `${A_BOLD}dependencies:${A_RESET}
`;
        for (const [n, v] of entries) text += `${n} ${A_DIM}${v}${A_RESET}
`;
        break;
      case "yarn":
        text += `${A_BOLD}${label}${A_RESET}
`;
        for (let i = 0; i < entries.length; i++) {
          const [n, v] = entries[i];
          const isLast = i === entries.length - 1;
          text += `${isLast ? "\u2514\u2500" : "\u251C\u2500"} ${n}@${A_CYAN}${v}${A_RESET}
`;
        }
        break;
      case "bun":
        for (const [n, v] of entries) text += `${n}@${A_DIM}${v}${A_RESET}
`;
        text += `
${A_DIM}${entries.length} packages installed${A_RESET}
`;
        break;
    }
    return {
      stdout: text,
      stderr: "",
      exitCode: 0
    };
  }
  async function npmInitOrCreate(args, sub, ctx) {
    const flags = args.filter((a) => a.startsWith("-"));
    const positional = args.filter((a) => !a.startsWith("-"));
    if (sub === "create" || sub === "init" && positional.length > 0) {
      const initializer = positional[0];
      let pkgSpec;
      if (initializer.startsWith("@")) {
        pkgSpec = initializer;
      } else {
        const atIdx = initializer.indexOf("@");
        if (atIdx > 0) {
          const name2 = initializer.slice(0, atIdx);
          const ver = initializer.slice(atIdx);
          pkgSpec = `create-${name2}${ver}`;
        } else {
          pkgSpec = `create-${initializer}`;
        }
      }
      return npxExecute([
        "-y",
        pkgSpec,
        ...positional.slice(1),
        ...flags
      ], ctx);
    }
    const p = `${ctx.cwd}/package.json`.replace(/\/+/g, "/");
    if (_vol.existsSync(p)) {
      return {
        stdout: "",
        stderr: formatWarn("package.json already exists", "npm"),
        exitCode: 0
      };
    }
    const isYes = flags.includes("-y") || flags.includes("--yes");
    const name = ctx.cwd.split("/").filter(Boolean).pop() || "my-project";
    const pkg = {
      name,
      version: "1.0.0",
      description: "",
      main: "index.js",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        start: "node index.js"
      },
      keywords: [],
      author: "",
      license: "ISC"
    };
    _vol.writeFileSync(p, JSON.stringify(pkg, null, 2));
    const out = isYes ? `Wrote to ${p}
` : `Wrote to ${p}

${JSON.stringify(pkg, null, 2)}
`;
    return {
      stdout: out,
      stderr: "",
      exitCode: 0
    };
  }
  async function npmInfo(args, ctx) {
    var _a;
    const name = args[0];
    if (!name) return {
      stdout: "",
      stderr: formatErr("Usage: npm info <package>", "npm"),
      exitCode: 1
    };
    const pkgJsonPath = `/node_modules/${name}/package.json`;
    if (_vol.existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(_vol.readFileSync(pkgJsonPath, "utf8"));
        let out = `${pkg.name}@${pkg.version}
`;
        if (pkg.description) out += `${pkg.description}
`;
        if (pkg.license) out += `license: ${pkg.license}
`;
        if (pkg.homepage) out += `homepage: ${pkg.homepage}
`;
        if (pkg.dependencies) {
          out += "\ndependencies:\n";
          for (const [k, v] of Object.entries(pkg.dependencies)) out += `  ${k}: ${v}
`;
        }
        return {
          stdout: out,
          stderr: "",
          exitCode: 0
        };
      } catch {
      }
    }
    try {
      const { RegistryClient } = await import("./index-DdYRf9qZ.js").then(async (m) => {
        await m.__tla;
        return m;
      }).then((n) => n.av);
      const client = new RegistryClient();
      const meta = await client.fetchManifest(name);
      const latest = (_a = meta["dist-tags"]) == null ? void 0 : _a.latest;
      let out = `${name}@${latest ?? "unknown"}
`;
      if (latest && meta.versions[latest]) {
        const ver = meta.versions[latest];
        if (ver.description) out += `${ver.description}
`;
        if (ver.license) out += `license: ${ver.license}
`;
        if (ver.homepage) out += `homepage: ${ver.homepage}
`;
      }
      return {
        stdout: out,
        stderr: "",
        exitCode: 0
      };
    } catch (e) {
      return {
        stdout: "",
        stderr: formatErr(`Not found: ${name}`, "npm"),
        exitCode: 1
      };
    }
  }
  function npmPack(ctx) {
    const r = loadManifest(ctx.cwd);
    if ("fail" in r) return r.fail;
    const notice = `${A_DIM}npm notice${A_RESET}`;
    let out = `${notice}
`;
    out += `${notice} ${A_BOLD}package:${A_RESET} ${r.pkg.name}@${r.pkg.version}
`;
    const files = [];
    const walk = (dir) => {
      try {
        for (const name of _vol.readdirSync(dir)) {
          if (name === "node_modules" || name.startsWith(".")) continue;
          const full = `${dir}/${name}`;
          const st = _vol.statSync(full);
          if (st.isDirectory()) walk(full);
          else files.push(full);
        }
      } catch {
      }
    };
    walk(ctx.cwd);
    for (const f of files) out += `${notice} ${f}
`;
    out += `${notice} ${A_BOLD}total files:${A_RESET} ${files.length}
`;
    return {
      stdout: out,
      stderr: "",
      exitCode: 0
    };
  }
  function npmConfig(args, ctx) {
    const sub = args[0];
    if (!sub || sub === "list") {
      let out = "; nodepod project config\n";
      out += `prefix = "${ctx.cwd}"
`;
      out += `registry = "${NPM_REGISTRY_URL_SLASH}"
`;
      return {
        stdout: out,
        stderr: "",
        exitCode: 0
      };
    }
    if (sub === "get") {
      const key = args[1];
      if (key === "prefix") return {
        stdout: ctx.cwd + "\n",
        stderr: "",
        exitCode: 0
      };
      if (key === "registry") return {
        stdout: NPM_REGISTRY_URL_SLASH + "\n",
        stderr: "",
        exitCode: 0
      };
      return {
        stdout: "undefined\n",
        stderr: "",
        exitCode: 0
      };
    }
    if (sub === "set") {
      return {
        stdout: "",
        stderr: formatWarn("config set: not supported in nodepod", "npm"),
        exitCode: 0
      };
    }
    return {
      stdout: "",
      stderr: formatErr(`config: unknown subcommand "${sub}"`, "npm"),
      exitCode: 1
    };
  }
  executeNodeBinary = async function(filePath, args, ctx, opts) {
    if (!_vol) return {
      stdout: "",
      stderr: "Volume unavailable\n",
      exitCode: 1
    };
    const rawPath = filePath.startsWith("/") ? filePath : `${ctx.cwd}/${filePath}`.replace(/\/+/g, "/");
    let resolved = "";
    if (_vol.existsSync(rawPath) && !_vol.statSync(rawPath).isDirectory()) {
      resolved = rawPath;
    } else {
      const exts = [
        ".js",
        ".mjs",
        ".cjs",
        ".ts",
        ".tsx",
        ".jsx"
      ];
      for (const ext of exts) {
        if (_vol.existsSync(rawPath + ext)) {
          resolved = rawPath + ext;
          break;
        }
      }
      if (!resolved) {
        const dirPath = rawPath.endsWith("/") ? rawPath : rawPath + "/";
        for (const idx of [
          "index.js",
          "index.mjs",
          "index.ts",
          "index.cjs"
        ]) {
          if (_vol.existsSync(dirPath + idx)) {
            resolved = dirPath + idx;
            break;
          }
        }
      }
    }
    if (!resolved) {
      const errMsg = `Cannot locate module '${rawPath}'
`;
      const errSink = getStderrSink();
      if (errSink) errSink(errMsg);
      return {
        stdout: "",
        stderr: errMsg,
        exitCode: 1
      };
    }
    let out = "";
    let err = "";
    let didExit = false;
    let code = 0;
    const pushOut = (s) => {
      out += s;
      const sink = getStdoutSink();
      if (sink) sink(s);
      return true;
    };
    const pushErr = (s) => {
      err += s;
      const sink = getStderrSink();
      if (sink) sink(s);
      return true;
    };
    const savedProcess = globalThis.process;
    const sandbox = new ScriptEngine(_vol, {
      cwd: ctx.cwd,
      env: ctx.env,
      onConsole: (m, cArgs) => {
        if (cArgs.length === 1) {
          const a = cArgs[0];
          if (a instanceof Error && a.message.startsWith("Process exited with code")) return;
          if (typeof a === "string" && a.startsWith("Error: Process exited with code")) return;
        }
        const line = format(cArgs[0], ...cArgs.slice(1)) + "\n";
        m === "error" ? pushErr(line) : pushOut(line);
      },
      onStdout: pushOut,
      onStderr: pushErr,
      workerThreadsOverride: opts == null ? void 0 : opts.workerThreadsOverride
    });
    const proc = sandbox.getProcess();
    proc._chdirHook = (dir) => {
      if (_shell) _shell.setCwd(dir);
    };
    proc.exit = (c = 0) => {
      if (getAllServers().size > 0 && c !== 0) {
        return;
      }
      if (!didExit) {
        didExit = true;
        code = c;
        proc.emit("exit", c);
      }
      throw new Error(`Process exited with code ${c}`);
    };
    proc.argv = [
      "node",
      resolved,
      ...args
    ];
    if (_ipcSendFn) {
      proc.send = (msg, _cb) => {
        if (_ipcSendFn) {
          _ipcSendFn(msg);
          if (typeof _cb === "function") _cb(null);
          return true;
        }
        return false;
      };
      proc.connected = true;
      proc.disconnect = () => {
        proc.connected = false;
      };
      setIPCReceiveHandler((data) => {
        proc.emit("message", data);
      });
    }
    const prevLiveStdin = _liveStdin;
    const myHaltSignal = getHaltSignal();
    if (myHaltSignal) {
      proc.stdout.isTTY = true;
      proc.stderr.isTTY = true;
      proc.stdin.isTTY = true;
      const cols = getTermCols();
      const rows = getTermRows();
      proc.stdout.columns = cols;
      proc.stdout.rows = rows;
      proc.stderr.columns = cols;
      proc.stderr.rows = rows;
      proc.stdin.setRawMode = (flag) => {
        proc.stdin.isRaw = flag;
        if (_rawModeChangeCb) _rawModeChangeCb(flag);
        return proc.stdin;
      };
      _liveStdin = proc.stdin;
      const ctx2 = getActiveContext();
      if (ctx2) ctx2.liveStdin = proc.stdin;
    }
    const isFork = !!(opts == null ? void 0 : opts.isFork);
    if (isFork) {
      ref();
      const origDisconnect = proc.disconnect;
      proc.disconnect = () => {
        origDisconnect == null ? void 0 : origDisconnect.call(proc);
        unref();
      };
    }
    let scriptError = null;
    let tlaSettled = false;
    try {
      const tlaPromise = sandbox.runFileTLA(resolved);
      tlaPromise.catch((e) => {
        if (e instanceof Error && e.message.startsWith("Process exited with code")) {
          return;
        }
        const msg = formatThrown(e);
        pushErr(`Error: ${msg}
`);
        if (!didExit) {
          didExit = true;
          code = 1;
        }
      }).finally(() => {
        tlaSettled = true;
      });
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("Process exited with code")) ;
      else {
        const msg = formatThrown(e);
        scriptError = e instanceof Error ? e : new Error(msg);
      }
    }
    const cleanup = () => {
      if (savedProcess) globalThis.process = savedProcess;
    };
    if (scriptError) {
      cleanup();
      const errMsg = scriptError.message || scriptError.name || "Unknown error";
      const errStack = scriptError.stack || "";
      const fullMsg = errStack && !errStack.includes(errMsg) ? `${errMsg}
${errStack}` : errStack || errMsg;
      return {
        stdout: out,
        stderr: err + `Error: ${fullMsg}
`,
        exitCode: 1
      };
    }
    if (didExit) {
      cleanup();
      return {
        stdout: out,
        stderr: err,
        exitCode: code
      };
    }
    await new Promise((r) => setTimeout(r, 0));
    const shouldStayAlive = () => {
      if (!tlaSettled) return true;
      if (getRefCount() > 0) return true;
      if (getAllServers().size > 0) return true;
      return false;
    };
    if (!myHaltSignal && !shouldStayAlive()) {
      cleanup();
      return {
        stdout: out,
        stderr: err,
        exitCode: 0
      };
    }
    const handledErrors = /* @__PURE__ */ new WeakSet();
    const rejHandler = (ev) => {
      ev.preventDefault();
      const r = ev.reason;
      if (r instanceof Error && r.message.startsWith("Process exited with code")) {
        return;
      }
      if (r != null && typeof r === "object") handledErrors.add(r);
      try {
        const hasHandler = proc.listenerCount ? proc.listenerCount("unhandledRejection") > 0 : false;
        proc.emit("unhandledRejection", r, ev.promise);
        if (hasHandler) return;
      } catch {
      }
      const rejMsg = r instanceof Error ? `Unhandled rejection: ${r.message}
${r.stack ?? ""}
` : `Unhandled rejection: ${String(r)}
`;
      pushErr(rejMsg);
    };
    const errHandler = (ev) => {
      ev.preventDefault();
      const e = ev.error ?? new Error(ev.message || "Unknown error");
      if (e != null && typeof e === "object" && handledErrors.has(e)) return;
      if (e != null && typeof e === "object") handledErrors.add(e);
      try {
        const hasUncaught = proc.listenerCount ? proc.listenerCount("uncaughtException") > 0 : false;
        proc.emit("uncaughtException", e);
        if (hasUncaught) return;
      } catch {
      }
      try {
        const hasRej = proc.listenerCount ? proc.listenerCount("unhandledRejection") > 0 : false;
        if (hasRej) return;
      } catch {
      }
      const msg = e instanceof Error ? `${e.stack || e.message}
` : `Uncaught: ${String(e)}
`;
      pushErr(msg);
    };
    globalThis.addEventListener("unhandledrejection", rejHandler);
    globalThis.addEventListener("error", errHandler);
    try {
      const haltPromise = myHaltSignal ? new Promise((r) => {
        if (myHaltSignal.aborted) {
          r();
          return;
        }
        myHaltSignal.addEventListener("abort", () => r(), {
          once: true
        });
      }) : null;
      let consecutiveEmpty = 0;
      let everNonEmpty = false;
      while (!didExit) {
        if (myHaltSignal == null ? void 0 : myHaltSignal.aborted) {
          break;
        }
        let wakeResolve;
        const wakePromise = new Promise((r) => {
          wakeResolve = r;
        });
        const removeDrain = addDrainListener(wakeResolve);
        const tickMs = !everNonEmpty && myHaltSignal && !out && !err ? TIMEOUTS.WAIT_LOOP_TICK : 50;
        const racers = [
          wakePromise,
          new Promise((r) => setTimeout(r, tickMs))
        ];
        if (haltPromise) racers.push(haltPromise);
        await Promise.race(racers);
        removeDrain();
        if (myHaltSignal == null ? void 0 : myHaltSignal.aborted) {
          break;
        }
        if (didExit) {
          break;
        }
        if (!shouldStayAlive()) {
          await new Promise((r) => queueMicrotask(r));
          if (didExit || (myHaltSignal == null ? void 0 : myHaltSignal.aborted)) break;
          if (shouldStayAlive()) {
            everNonEmpty = true;
            consecutiveEmpty = 0;
            continue;
          }
          consecutiveEmpty++;
          if (myHaltSignal) {
            if (!everNonEmpty && !out && !err) {
              if (consecutiveEmpty >= 50) {
                break;
              }
            } else if (!everNonEmpty) {
              if (consecutiveEmpty >= Math.ceil(2e3 / tickMs)) {
                break;
              }
            } else {
              if (consecutiveEmpty >= 100) {
                break;
              }
            }
          } else {
            break;
          }
        } else {
          consecutiveEmpty = 0;
          everNonEmpty = true;
        }
      }
      return {
        stdout: out,
        stderr: err,
        exitCode: didExit ? code : 0
      };
    } finally {
      cleanup();
      proc.exit = () => {
      };
      globalThis.removeEventListener("unhandledrejection", rejHandler);
      globalThis.removeEventListener("error", errHandler);
      _liveStdin = prevLiveStdin;
      const ctxRestore = getActiveContext();
      if (ctxRestore) ctxRestore.liveStdin = prevLiveStdin;
      closeAllServers();
      resetRefCount();
      resetActiveInterfaceCount();
    }
  };
  async function npxExecute(params, ctx) {
    if (!_vol) return {
      stdout: "",
      stderr: "Volume unavailable\n",
      exitCode: 1
    };
    let autoInstall = true;
    let installPkg = null;
    const filteredParams = [];
    let separatorSeen = false;
    for (let i = 0; i < params.length; i++) {
      if (separatorSeen) {
        filteredParams.push(params[i]);
        continue;
      }
      if (params[i] === "--") {
        separatorSeen = true;
        continue;
      }
      if (params[i] === "-y" || params[i] === "--yes") {
        autoInstall = true;
        continue;
      }
      if (params[i] === "-n" || params[i] === "--no") {
        autoInstall = false;
        continue;
      }
      if ((params[i] === "-p" || params[i] === "--package") && i + 1 < params.length) {
        installPkg = params[++i];
        continue;
      }
      if (params[i] === "--help" || params[i] === "-h") {
        return {
          stdout: `${A_BOLD}Usage:${A_RESET} npx [options] <command> [args...]

${A_BOLD}Options:${A_RESET}
  ${A_CYAN}-y${A_RESET}, ${A_CYAN}--yes${A_RESET}       Auto-confirm install
  ${A_CYAN}-n${A_RESET}, ${A_CYAN}--no${A_RESET}        Don't install if not found
  ${A_CYAN}-p${A_RESET}, ${A_CYAN}--package${A_RESET}   Specify package to install
  ${A_CYAN}--${A_RESET}              Separator for command args
`,
          stderr: "",
          exitCode: 0
        };
      }
      filteredParams.push(params[i]);
    }
    let pkgSpec = filteredParams[0];
    if (!pkgSpec) {
      return {
        stdout: "",
        stderr: formatErr("missing command", "npm"),
        exitCode: 1
      };
    }
    let cmdName;
    if (pkgSpec.startsWith("@")) {
      const rest = pkgSpec.slice(1);
      const atIdx = rest.indexOf("@");
      if (atIdx > 0 && rest.indexOf("/") < atIdx) {
        cmdName = "@" + rest.slice(0, atIdx);
        rest.slice(atIdx + 1);
      } else {
        cmdName = pkgSpec;
      }
    } else {
      const atIdx = pkgSpec.indexOf("@");
      if (atIdx > 0) {
        cmdName = pkgSpec.slice(0, atIdx);
        pkgSpec.slice(atIdx + 1);
      } else {
        cmdName = pkgSpec;
      }
    }
    const actualPkg = installPkg || pkgSpec;
    installPkg ? installPkg.replace(/@[^@/]+$/, "").replace(/^@/, "") : cmdName;
    let resolvedBin = findBinary(cmdName, _vol, ctx.cwd);
    if (!resolvedBin && autoInstall) {
      const installResult = await installPackages([
        actualPkg
      ], ctx);
      if (installResult.exitCode !== 0) return installResult;
      resolvedBin = findBinary(cmdName, _vol, ctx.cwd);
    }
    if (!resolvedBin) {
      return {
        stdout: "",
        stderr: `npx: command '${cmdName}' not found
`,
        exitCode: 1
      };
    }
    return executeNodeBinary(resolvedBin, filteredParams.slice(1), ctx);
  }
  function findBinary(name, vol, cwd) {
    const cleanName = name.startsWith("@") ? name : name;
    const shortName = cleanName.includes("/") ? cleanName.split("/").pop() : cleanName;
    const searchRoots = cwd && cwd !== "/" ? [
      `${cwd}/node_modules`,
      `/node_modules`
    ] : [
      `/node_modules`
    ];
    for (const nmDir of searchRoots) {
      const pkgJsonPath = `${nmDir}/${cleanName}/package.json`;
      if (vol.existsSync(pkgJsonPath)) {
        try {
          const pkg = JSON.parse(vol.readFileSync(pkgJsonPath, "utf8"));
          if (pkg.bin) {
            if (typeof pkg.bin === "string") {
              return `${nmDir}/${cleanName}/${pkg.bin}`;
            }
            if (typeof pkg.bin === "object") {
              const binMap = pkg.bin;
              const binEntry = binMap[shortName] || binMap[cleanName] || Object.values(binMap)[0];
              if (binEntry) return `${nmDir}/${cleanName}/${binEntry}`;
            }
          }
          if (pkg.main) return `${nmDir}/${cleanName}/${pkg.main}`;
        } catch {
        }
      }
      const binPath = `${nmDir}/.bin/${name}`;
      if (vol.existsSync(binPath)) {
        try {
          const stub = vol.readFileSync(binPath, "utf8");
          const match = stub.match(/node\s+"([^"]+)"/);
          if (match && vol.existsSync(match[1])) return match[1];
        } catch {
        }
      }
    }
    return null;
  }
  exec = function(command, optsOrCb, cb) {
    let options = {};
    let done;
    if (typeof optsOrCb === "function") {
      done = optsOrCb;
    } else if (optsOrCb) {
      options = optsOrCb;
      done = cb;
    }
    const child = new ShellProcess();
    if (!_shell) {
      const e = new Error("[Nodepod] exec requires shell. Call initShellExec() first.");
      setTimeout(() => {
        child.emit("error", e);
        if (done) done(e, "", "");
      }, 0);
      return child;
    }
    const cwd = options.cwd ?? getShellCwd();
    const env = options.env ?? void 0;
    _shell.exec(command, {
      cwd,
      env
    }).then((result) => {
      var _a, _b, _c, _d;
      const { stdout, stderr, exitCode } = result;
      if (stdout) (_a = child.stdout) == null ? void 0 : _a.push(Buffer2.from(stdout));
      if (stderr) (_b = child.stderr) == null ? void 0 : _b.push(Buffer2.from(stderr));
      (_c = child.stdout) == null ? void 0 : _c.push(null);
      (_d = child.stderr) == null ? void 0 : _d.push(null);
      child.exitCode = exitCode;
      child.emit("close", exitCode, null);
      child.emit("exit", exitCode, null);
      if (done) {
        if (exitCode !== 0) {
          const e = new Error(`Command failed: ${command}`);
          e.code = exitCode;
          done(e, stdout ?? "", stderr ?? "");
        } else {
          done(null, stdout ?? "", stderr ?? "");
        }
      }
    }, (e) => {
      child.emit("error", e instanceof Error ? e : new Error(String(e)));
      if (done) done(e instanceof Error ? e : new Error(String(e)), "", "");
    });
    return child;
  };
  execSync = function(cmd, opts) {
    var _a, _b;
    const trimmed = cmd.trim();
    const encoding = opts == null ? void 0 : opts.encoding;
    const result = handleSyncCommand(trimmed, opts);
    if (result !== null) {
      if (encoding === "buffer") return Buffer2.from(result);
      return result;
    }
    if (!_syncChannel) {
      throw new Error("[Nodepod] execSync requires SyncChannel (worker mode with SharedArrayBuffer). Ensure Nodepod is running in worker mode with COOP/COEP headers.");
    }
    const slot = _syncChannel.allocateSlot();
    const cwd = (opts == null ? void 0 : opts.cwd) ?? ((_b = (_a = globalThis.process) == null ? void 0 : _a.cwd) == null ? void 0 : _b.call(_a)) ?? "/";
    const env = (opts == null ? void 0 : opts.env) ?? {};
    self.postMessage({
      type: "spawn-sync",
      requestId: _nextSyncRequestId++,
      command: trimmed.split(/\s+/)[0],
      args: trimmed.split(/\s+/).slice(1),
      cwd,
      env,
      syncSlot: slot,
      shellCommand: trimmed
    });
    const { exitCode, stdout } = _syncChannel.waitForResult(slot, 12e4);
    if (exitCode !== 0) {
      const err = new Error(`Command failed: ${trimmed}
${stdout}`);
      err.status = exitCode;
      err.stderr = Buffer2.from("");
      err.stdout = Buffer2.from(stdout);
      err.output = [
        null,
        err.stdout,
        err.stderr
      ];
      throw err;
    }
    if (encoding === "buffer") return Buffer2.from(stdout);
    return stdout;
  };
  let _nextSyncRequestId = 1;
  const KNOWN_BINS = {
    node: "/usr/local/bin/node",
    npm: "/usr/local/bin/npm",
    npx: "/usr/local/bin/npx",
    pnpm: "/usr/local/bin/pnpm",
    yarn: "/usr/local/bin/yarn",
    bun: "/usr/local/bin/bun",
    bunx: "/usr/local/bin/bunx",
    git: "/usr/bin/git"
  };
  function isBinaryAvailable(name) {
    if (KNOWN_BINS[name]) return KNOWN_BINS[name];
    if (_vol) {
      const binPath = `/node_modules/.bin/${name}`;
      if (_vol.existsSync(binPath)) return binPath;
    }
    return null;
  }
  function throwCommandNotFound(cmd) {
    const err = new Error(`Command failed: ${cmd}
/bin/sh: 1: ${cmd.split(/\s+/)[0]}: not found
`);
    err.status = 127;
    err.stderr = Buffer2.from(`/bin/sh: 1: ${cmd.split(/\s+/)[0]}: not found
`);
    err.stdout = Buffer2.from("");
    throw err;
  }
  function _findGitDir(cwd) {
    if (!_vol) return null;
    let dir = cwd;
    while (true) {
      const gitPath = dir + "/.git";
      try {
        if (_vol.existsSync(gitPath)) return {
          gitDir: gitPath,
          workDir: dir
        };
      } catch {
      }
      const parent = dir.substring(0, dir.lastIndexOf("/")) || "/";
      if (parent === dir) break;
      dir = parent;
    }
    try {
      if (_vol.existsSync("/.git")) return {
        gitDir: "/.git",
        workDir: "/"
      };
    } catch {
    }
    return null;
  }
  function _readHeadBranch(gitDir) {
    try {
      const head = _vol.readFileSync(gitDir + "/HEAD", "utf8").trim();
      if (head.startsWith("ref: refs/heads/")) return head.slice(16);
      return head.slice(0, 7);
    } catch {
      return "main";
    }
  }
  function _resolveHeadHash(gitDir) {
    try {
      const head = _vol.readFileSync(gitDir + "/HEAD", "utf8").trim();
      if (head.startsWith("ref: ")) {
        const refPath = gitDir + "/" + head.slice(5);
        return _vol.readFileSync(refPath, "utf8").trim();
      }
      return head;
    } catch {
      return null;
    }
  }
  function _readGitConfigKey(gitDir, key) {
    try {
      const config = _vol.readFileSync(gitDir + "/config", "utf8");
      const parts = key.split(".");
      let sectionName, subSection = null, propName;
      if (parts.length === 3) {
        sectionName = parts[0];
        subSection = parts[1];
        propName = parts[2];
      } else if (parts.length === 2) {
        sectionName = parts[0];
        propName = parts[1];
      } else return null;
      const lines = config.split("\n");
      let inSection = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("[")) {
          inSection = subSection ? trimmed === `[${sectionName} "${subSection}"]` : trimmed === `[${sectionName}]`;
          continue;
        }
        if (inSection) {
          const m = trimmed.match(/^(\w+)\s*=\s*(.*)$/);
          if (m && m[1] === propName) return m[2].trim();
        }
      }
    } catch {
    }
    return null;
  }
  function handleSyncCommand(cmd, opts) {
    if (/^node\s+(--version|-v)\s*$/.test(cmd)) return VERSIONS.NODE + "\n";
    if (/^npm\s+(--version|-v)\s*$/.test(cmd)) return VERSIONS.NPM + "\n";
    if (/^pnpm\s+(--version|-v)\s*$/.test(cmd)) return VERSIONS.PNPM + "\n";
    if (/^yarn\s+(--version|-v)\s*$/.test(cmd)) return VERSIONS.YARN + "\n";
    if (/^bun\s+(--version|-v)\s*$/.test(cmd)) return VERSIONS.BUN + "\n";
    const whichMatch = cmd.match(/^(?:which|command\s+-v)\s+(\S+)\s*$/);
    if (whichMatch) {
      const binName = whichMatch[1];
      const binPath = isBinaryAvailable(binName);
      if (binPath) return binPath + "\n";
      throwCommandNotFound(cmd);
    }
    const versionMatch = cmd.match(/^(\S+)\s+(--version|-v)\s*$/);
    if (versionMatch) {
      const binName = versionMatch[1];
      if (binName === "node" || binName === "npm" || binName === "pnpm" || binName === "yarn" || binName === "bun") return null;
      if (!isBinaryAvailable(binName)) throwCommandNotFound(cmd);
    }
    if (/^(?:npm|yarn|pnpm)\s+config\s+get\s+registry\s*$/.test(cmd)) {
      return NPM_REGISTRY_URL_SLASH.replace(/\/$/, "") + "\n";
    }
    const echoMatch = cmd.match(/^echo\s+["']?(.*?)["']?\s*$/);
    if (echoMatch) return echoMatch[1] + "\n";
    if (/^uname\s+-s\s*$/.test(cmd)) return "Linux\n";
    if (/^uname\s+-m\s*$/.test(cmd)) return "x86_64\n";
    if (/^uname\s+-a\s*$/.test(cmd)) return "Linux nodepod 5.10.0 #1 SMP x86_64 GNU/Linux\n";
    if (/^git\s+(--version|-v)\s*$/.test(cmd) || cmd === "git --version") {
      return "git version " + VERSIONS.GIT + "\n";
    }
    if (_vol) {
      const gitRevParseMatch = cmd.match(/^git\s+rev-parse\s+(.+)$/);
      if (gitRevParseMatch) {
        const gitArgs = gitRevParseMatch[1].trim();
        const cwd = (opts == null ? void 0 : opts.cwd) || "/";
        const gd = _findGitDir(cwd);
        if (gitArgs === "--show-toplevel") return gd ? gd.workDir + "\n" : "";
        if (gitArgs === "--is-inside-work-tree") return gd ? "true\n" : "false\n";
        if (gitArgs === "--git-dir") return gd ? ".git\n" : "";
        if (gitArgs === "--is-bare-repository") return "false\n";
        if (gitArgs === "--abbrev-ref HEAD" && gd) return _readHeadBranch(gd.gitDir) + "\n";
        if ((gitArgs === "HEAD" || gitArgs === "--verify HEAD") && gd) {
          const h = _resolveHeadHash(gd.gitDir);
          return h ? h + "\n" : "";
        }
        if (gitArgs === "--short HEAD" && gd) {
          const h = _resolveHeadHash(gd.gitDir);
          return h ? h.slice(0, 7) + "\n" : "";
        }
      }
      if (/^git\s+branch\s+--show-current\s*$/.test(cmd)) {
        const cwd = (opts == null ? void 0 : opts.cwd) || "/";
        const gd = _findGitDir(cwd);
        if (gd) return _readHeadBranch(gd.gitDir) + "\n";
      }
      const gitConfigGetMatch = cmd.match(/^git\s+config\s+(?:--get\s+)?(\S+)\s*$/);
      if (gitConfigGetMatch) {
        const cwd = (opts == null ? void 0 : opts.cwd) || "/";
        const gd = _findGitDir(cwd);
        if (gd) {
          const val = _readGitConfigKey(gd.gitDir, gitConfigGetMatch[1]);
          return val !== null ? val + "\n" : "";
        }
        return "";
      }
    }
    if (/^git\s/.test(cmd)) return "";
    if (cmd === "true" || cmd === ":") return "";
    if (cmd === "pwd") return ((opts == null ? void 0 : opts.cwd) || "/") + "\n";
    if (cmd.startsWith("cat ") && _vol) {
      const path = cmd.slice(4).trim().replace(/['"]/g, "");
      try {
        return _vol.readFileSync(path, "utf8");
      } catch {
        return "";
      }
    }
    if ((cmd === "ls" || cmd.startsWith("ls ")) && _vol) {
      const dir = cmd === "ls" ? (opts == null ? void 0 : opts.cwd) || "/" : cmd.slice(3).trim().replace(/['"]/g, "");
      try {
        return _vol.readdirSync(dir).join("\n") + "\n";
      } catch {
        return "";
      }
    }
    const testMatch = cmd.match(/^(?:test|\[)\s+(-[fd])\s+["']?(.*?)["']?\s*\]?\s*$/);
    if (testMatch && _vol) {
      const flag = testMatch[1];
      const path = testMatch[2];
      try {
        const st = _vol.statSync(path);
        if (flag === "-f" && st.isFile()) return "";
        if (flag === "-d" && st.isDirectory()) return "";
      } catch {
      }
      return "";
    }
    return null;
  }
  spawn = function(command, argsOrOpts, opts) {
    let spawnArgs = [];
    let cfg = {};
    if (Array.isArray(argsOrOpts)) {
      spawnArgs = argsOrOpts;
      cfg = opts ?? {};
    } else if (argsOrOpts) cfg = argsOrOpts;
    const child = new ShellProcess();
    if (_spawnChildFn) {
      const cwd = cfg.cwd ?? getShellCwd();
      const env = cfg.env ?? {};
      spawnArgs.length ? `${command} ${spawnArgs.join(" ")}` : command;
      ref();
      _spawnChildFn(command, spawnArgs, {
        cwd,
        env,
        stdio: "pipe",
        onStdout: (data) => {
          var _a;
          (_a = child.stdout) == null ? void 0 : _a.push(Buffer2.from(data));
          const sink = getStdoutSink();
          if (sink) sink(data);
        },
        onStderr: (data) => {
          var _a;
          (_a = child.stderr) == null ? void 0 : _a.push(Buffer2.from(data));
          const sink = getStderrSink();
          if (sink) sink(data);
        }
      }).then(({ exitCode }) => {
        var _a, _b;
        unref();
        (_a = child.stdout) == null ? void 0 : _a.push(null);
        (_b = child.stderr) == null ? void 0 : _b.push(null);
        child.exitCode = exitCode;
        child.emit("close", exitCode, null);
        child.emit("exit", exitCode, null);
      }).catch((e) => {
        unref();
        child.emit("error", e instanceof Error ? e : new Error(String(e)));
      });
    } else if (_shell) {
      const cwd = cfg.cwd ?? getShellCwd();
      const env = cfg.env ?? void 0;
      const fullCmd = spawnArgs.length ? `${command} ${spawnArgs.map((a) => a.includes(" ") ? `"${a}"` : a).join(" ")}` : command;
      _shell.exec(fullCmd, {
        cwd,
        env
      }).then((result) => {
        var _a, _b, _c, _d;
        const { stdout, stderr, exitCode } = result;
        if (stdout) (_a = child.stdout) == null ? void 0 : _a.push(Buffer2.from(stdout));
        if (stderr) (_b = child.stderr) == null ? void 0 : _b.push(Buffer2.from(stderr));
        (_c = child.stdout) == null ? void 0 : _c.push(null);
        (_d = child.stderr) == null ? void 0 : _d.push(null);
        child.exitCode = exitCode;
        child.emit("close", exitCode, null);
        child.emit("exit", exitCode, null);
      }, (e) => {
        child.emit("error", e instanceof Error ? e : new Error(String(e)));
      });
    } else {
      setTimeout(() => {
        child.emit("error", new Error("[Nodepod] spawn requires shell or worker mode."));
      }, 0);
    }
    queueMicrotask(() => child.emit("spawn"));
    return child;
  };
  spawnSync = function(cmd, args, opts) {
    var _a, _b;
    let spawnArgs = [];
    let cfg = {};
    if (Array.isArray(args)) {
      spawnArgs = args;
      cfg = opts ?? {};
    } else if (args) {
      cfg = args;
    }
    const full = spawnArgs.length ? `${cmd} ${spawnArgs.join(" ")}` : cmd;
    const syncResult = handleSyncCommand(full, {
      cwd: cfg.cwd,
      env: cfg.env
    });
    if (syncResult !== null) {
      const stdout = Buffer2.from(syncResult);
      const stderr = Buffer2.from("");
      return {
        stdout,
        stderr,
        status: 0,
        signal: null,
        pid: MOCK_PID.BASE + Math.floor(Math.random() * MOCK_PID.RANGE),
        output: [
          null,
          stdout,
          stderr
        ]
      };
    }
    if (!_syncChannel) {
      throw new Error("[Nodepod] spawnSync requires SyncChannel (worker mode with SharedArrayBuffer). Ensure Nodepod is running in worker mode with COOP/COEP headers.");
    }
    const slot = _syncChannel.allocateSlot();
    const cwd = cfg.cwd ?? ((_b = (_a = globalThis.process) == null ? void 0 : _a.cwd) == null ? void 0 : _b.call(_a)) ?? "/";
    const env = cfg.env ?? {};
    self.postMessage({
      type: "spawn-sync",
      requestId: _nextSyncRequestId++,
      command: full.split(/\s+/)[0],
      args: full.split(/\s+/).slice(1),
      cwd,
      env,
      syncSlot: slot,
      shellCommand: full
    });
    try {
      const { exitCode, stdout: stdoutStr } = _syncChannel.waitForResult(slot, 12e4);
      const stdout = Buffer2.from(stdoutStr);
      const stderr = Buffer2.from("");
      return {
        stdout,
        stderr,
        status: exitCode,
        signal: null,
        pid: MOCK_PID.BASE + Math.floor(Math.random() * MOCK_PID.RANGE),
        output: [
          null,
          stdout,
          stderr
        ]
      };
    } catch (e) {
      const stdout = Buffer2.from((e == null ? void 0 : e.stdout) ?? "");
      const stderr = Buffer2.from((e == null ? void 0 : e.message) ?? "");
      return {
        stdout,
        stderr,
        status: (e == null ? void 0 : e.status) ?? 1,
        signal: null,
        pid: MOCK_PID.BASE + Math.floor(Math.random() * MOCK_PID.RANGE),
        output: [
          null,
          stdout,
          stderr
        ],
        error: e instanceof Error ? e : new Error(String(e))
      };
    }
  };
  execFileSync = function(file, args, opts) {
    const cmd = (args == null ? void 0 : args.length) ? `${file} ${args.join(" ")}` : file;
    return execSync(cmd, opts);
  };
  execFile = function(file, argsOrOpts, optsOrCb, cb) {
    let fileArgs = [];
    let options = {};
    let done;
    if (Array.isArray(argsOrOpts)) {
      fileArgs = argsOrOpts;
      if (typeof optsOrCb === "function") done = optsOrCb;
      else if (optsOrCb) {
        options = optsOrCb;
        done = cb;
      }
    } else if (typeof argsOrOpts === "function") {
      done = argsOrOpts;
    } else if (argsOrOpts) {
      options = argsOrOpts;
      done = optsOrCb;
    }
    const cmd = fileArgs.length ? `${file} ${fileArgs.join(" ")}` : file;
    return exec(cmd, options, done);
  };
  fork = function(modulePath, argsOrOpts, opts) {
    let args = [];
    let cfg = {};
    if (Array.isArray(argsOrOpts)) {
      args = argsOrOpts;
      cfg = opts ?? {};
    } else if (argsOrOpts) cfg = argsOrOpts;
    const cwd = cfg.cwd || getShellCwd();
    const env = cfg.env || ((_shell == null ? void 0 : _shell.getEnv()) ?? {});
    const resolved = modulePath.startsWith("/") ? modulePath : `${cwd}/${modulePath}`.replace(/\/+/g, "/");
    const child = new ShellProcess();
    child.connected = true;
    child.spawnargs = [
      "node",
      resolved,
      ...args
    ];
    child.spawnfile = "node";
    if (!_forkChildFn) {
      setTimeout(() => {
        child.emit("error", new Error("[Nodepod] fork requires worker mode. No forkChild callback set."));
      }, 0);
      return child;
    }
    ref();
    const handle = _forkChildFn(resolved, args, {
      cwd,
      env,
      onStdout: (data) => {
        var _a;
        (_a = child.stdout) == null ? void 0 : _a.emit("data", data);
        const sink = getStdoutSink();
        if (sink) sink(data);
      },
      onStderr: (data) => {
        var _a;
        (_a = child.stderr) == null ? void 0 : _a.emit("data", data);
        const sink = getStderrSink();
        if (sink) sink(data);
      },
      onIPC: (data) => {
        child.emit("message", data);
      },
      onExit: (exitCode) => {
        unref();
        child.exitCode = exitCode;
        child.connected = false;
        child.emit("exit", exitCode, null);
        child.emit("close", exitCode, null);
      }
    });
    child.send = (msg, _cb) => {
      if (!child.connected) return false;
      handle.sendIPC(msg);
      return true;
    };
    child.kill = (sig) => {
      child.killed = true;
      child.connected = false;
      handle.disconnect();
      child.emit("exit", null, sig ?? "SIGTERM");
      child.emit("close", null, sig ?? "SIGTERM");
      return true;
    };
    child.disconnect = () => {
      child.connected = false;
      handle.disconnect();
      child.emit("disconnect");
    };
    return child;
  };
  ShellProcess = function ShellProcess2() {
    if (!this) return;
    EventEmitter.call(this);
    this.pid = MOCK_PID.BASE + Math.floor(Math.random() * MOCK_PID.RANGE);
    this.connected = false;
    this.killed = false;
    this.exitCode = null;
    this.signalCode = null;
    this.spawnargs = [];
    this.spawnfile = "";
    this.stdin = new Writable();
    this.stdout = new Readable();
    this.stderr = new Readable();
  };
  Object.setPrototypeOf(ShellProcess.prototype, EventEmitter.prototype);
  ShellProcess.prototype.kill = function kill(sig) {
    this.killed = true;
    this.emit("exit", null, sig ?? "SIGTERM");
    return true;
  };
  ShellProcess.prototype.disconnect = function disconnect() {
    this.connected = false;
  };
  ShellProcess.prototype.send = function send(msg, cb) {
    if (cb) cb(new Error("IPC unavailable"));
    return false;
  };
  ShellProcess.prototype.ref = function ref2() {
    return this;
  };
  ShellProcess.prototype.unref = function unref2() {
    return this;
  };
  child_process = {
    exec,
    execSync,
    execFile,
    execFileSync,
    spawn,
    spawnSync,
    fork,
    ShellProcess,
    initShellExec,
    shellExec,
    setStreamingCallbacks,
    clearStreamingCallbacks,
    sendStdin,
    setSyncChannel,
    setSpawnChildCallback,
    setForkChildCallback,
    setIPCSend,
    setIPCReceiveHandler,
    handleIPCFromParent,
    executeNodeBinary
  };
});
export {
  ShellProcess,
  __tla,
  clearStreamingCallbacks,
  child_process as default,
  exec,
  execFile,
  execFileSync,
  execSync,
  executeNodeBinary,
  fork,
  getShellCwd,
  handleIPCFromParent,
  initShellExec,
  isStdinRaw,
  sendStdin,
  setForkChildCallback,
  setIPCReceiveHandler,
  setIPCSend,
  setShellCwd,
  setSpawnChildCallback,
  setStreamingCallbacks,
  setSyncChannel,
  shellExec,
  spawn,
  spawnSync
};

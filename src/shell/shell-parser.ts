// Tokenizer + recursive-descent parser.
// Converts a shell command string into an AST (ListNode).

import type {
  Token,
  TokenType,
  ListNode,
  ListEntry,
  ListOperator,
  PipelineNode,
  CommandNode,
  RedirectNode,
} from "./shell-types";
import type { MemoryVolume } from "../memory-volume";

/* ------------------------------------------------------------------ */
/*  Variable & substitution expansion                                  */
/* ------------------------------------------------------------------ */

// Expand $VAR, ${VAR}, $?, $$, $0, and tilde.
// Single-quote handling is the caller's job.
export function expandVariables(
  raw: string,
  env: Record<string, string>,
  lastExit: number,
): string {
  let result = "";
  let i = 0;

  if (raw === "~" || raw.startsWith("~/")) {
    const home = env.HOME || "/home/user";
    return home + raw.slice(1);
  }

  while (i < raw.length) {
    if (raw[i] === "\\") {
      i++;
      if (i < raw.length) result += raw[i++];
      continue;
    }

    if (raw[i] === "$") {
      i++;
      if (i >= raw.length) {
        result += "$";
        break;
      }

      if (raw[i] === "?") {
        result += String(lastExit);
        i++;
        continue;
      }
      if (raw[i] === "$") {
        result += "1"; // stub PID
        i++;
        continue;
      }
      if (raw[i] === "0") {
        result += "nodepod";
        i++;
        continue;
      }
      if (raw[i] === "#") {
        result += "0"; // $# stub
        i++;
        continue;
      }

      if (raw[i] === "{") {
        i++;
        let name = "";
        while (i < raw.length && raw[i] !== "}" && raw[i] !== ":" && raw[i] !== "-" && raw[i] !== "=") {
          name += raw[i++];
        }
        let defaultVal = "";
        let useDefault = false;
        if (i < raw.length && (raw[i] === ":" || raw[i] === "-")) {
          useDefault = true;
          if (raw[i] === ":") i++;
          if (i < raw.length && (raw[i] === "-" || raw[i] === "=")) i++;
          while (i < raw.length && raw[i] !== "}") {
            defaultVal += raw[i++];
          }
        }
        if (i < raw.length && raw[i] === "}") i++;

        const val = env[name];
        if (val !== undefined && val !== "") {
          result += val;
        } else if (useDefault) {
          result += defaultVal;
        }
        continue;
      }

      let name = "";
      while (i < raw.length && /[a-zA-Z0-9_]/.test(raw[i])) {
        name += raw[i++];
      }
      if (name) {
        result += env[name] ?? "";
      } else {
        result += "$";
      }
      continue;
    }

    result += raw[i++];
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Glob expansion                                                     */
/* ------------------------------------------------------------------ */

export function expandGlob(
  pattern: string,
  cwd: string,
  volume: MemoryVolume,
): string[] {
  if (!pattern.includes("*") && !pattern.includes("?")) return [pattern];

  const lastSlash = pattern.lastIndexOf("/");
  let dir: string;
  let filePattern: string;

  if (lastSlash === -1) {
    dir = cwd;
    filePattern = pattern;
  } else {
    dir = pattern.slice(0, lastSlash) || "/";
    if (!dir.startsWith("/")) dir = `${cwd}/${dir}`.replace(/\/+/g, "/");
    filePattern = pattern.slice(lastSlash + 1);
  }

  try {
    const entries = volume.readdirSync(dir);
    const regex = globToRegex(filePattern);
    const matches = entries.filter((e) => regex.test(e));

    if (matches.length === 0) return [pattern];

    return matches.sort().map((m) =>
      lastSlash === -1 ? m : `${dir}/${m}`.replace(/\/+/g, "/"),
    );
  } catch {
    return [pattern];
  }
}

function globToRegex(pattern: string): RegExp {
  let regex = "^";
  for (const ch of pattern) {
    if (ch === "*") regex += ".*";
    else if (ch === "?") regex += ".";
    else if (".+^${}()|[]\\".includes(ch)) regex += "\\" + ch;
    else regex += ch;
  }
  regex += "$";
  return new RegExp(regex);
}

/* ------------------------------------------------------------------ */
/*  Tokenizer                                                          */
/* ------------------------------------------------------------------ */

export function tokenize(
  input: string,
  env: Record<string, string>,
  lastExit: number,
): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  // After a heredoc operator is tokenized, the body lines must be skipped
  // when the tokenizer reaches the newline at the end of the command line.
  let heredocPendingSkipTo: number | null = null;

  while (i < input.length) {
    if (input[i] === " " || input[i] === "\t") {
      i++;
      continue;
    }

    if (input[i] === "\n") {
      tokens.push({ type: "newline", value: "\n" });
      i++;
      if (heredocPendingSkipTo !== null) {
        i = heredocPendingSkipTo;
        heredocPendingSkipTo = null;
      }
      continue;
    }

    if (input[i] === "#") {
      while (i < input.length && input[i] !== "\n") i++;
      continue;
    }

    if (input.slice(i, i + 4) === "2>&1") {
      tokens.push({ type: "redirect-2to1", value: "2>&1" });
      i += 4;
      continue;
    }

    if (input[i] === ">" && input[i + 1] === ">") {
      tokens.push({ type: "redirect-app", value: ">>" });
      i += 2;
      continue;
    }

    if (input[i] === ">") {
      tokens.push({ type: "redirect-out", value: ">" });
      i++;
      continue;
    }

    if (input[i] === "<") {
      // Heredoc: << or <<-
      if (input[i + 1] === "<") {
        i += 2;
        let stripTabs = false;
        if (i < input.length && input[i] === "-") {
          stripTabs = true;
          i++;
        }

        // Skip whitespace between << and delimiter
        while (i < input.length && (input[i] === " " || input[i] === "\t")) i++;

        // Read delimiter, handling optional quotes
        let delimiter = "";
        let quoted = false;
        if (i < input.length && (input[i] === "'" || input[i] === '"')) {
          quoted = true;
          const q = input[i++];
          while (i < input.length && input[i] !== q) delimiter += input[i++];
          if (i < input.length) i++; // skip closing quote
        } else {
          while (
            i < input.length &&
            input[i] !== " " && input[i] !== "\t" &&
            input[i] !== "\n" && input[i] !== "|" &&
            input[i] !== ";" && input[i] !== "&" &&
            input[i] !== ">" && input[i] !== "<"
          ) {
            delimiter += input[i++];
          }
        }

        if (!delimiter) {
          // Malformed — fall back to two redirect-ins
          tokens.push({ type: "redirect-in", value: "<" });
          tokens.push({ type: "redirect-in", value: "<" });
          continue;
        }

        // Find the newline that ends the current command line
        const nlIdx = input.indexOf("\n", i);
        if (nlIdx === -1) {
          // No body possible — emit empty heredoc
          tokens.push({ type: "heredoc", value: "" });
          continue;
        }

        // Scan body starting after that newline
        let body = "";
        let scanIdx = nlIdx + 1;
        let foundEnd = false;

        while (scanIdx <= input.length) {
          let lineEnd = input.indexOf("\n", scanIdx);
          if (lineEnd === -1) lineEnd = input.length;

          const rawLine = input.slice(scanIdx, lineEnd);
          const checkLine = stripTabs ? rawLine.replace(/^\t+/, "") : rawLine;

          if (checkLine === delimiter) {
            foundEnd = true;
            heredocPendingSkipTo = lineEnd < input.length ? lineEnd + 1 : lineEnd;
            break;
          }

          body += (stripTabs ? rawLine.replace(/^\t+/, "") : rawLine) + "\n";
          scanIdx = lineEnd + 1;
          if (scanIdx > input.length) break;
        }

        if (!foundEnd) {
          // Unterminated heredoc — use remaining input as body
          heredocPendingSkipTo = input.length;
        }

        // Expand variables in body for unquoted delimiters
        if (!quoted) {
          body = expandVariables(body, env, lastExit);
        }

        tokens.push({ type: "heredoc", value: body });
        // i stays after the delimiter name — rest of the line is tokenized normally
        continue;
      }

      // Single < — existing redirect-in
      tokens.push({ type: "redirect-in", value: "<" });
      i++;
      continue;
    }

    if (input[i] === "&" && input[i + 1] === "&") {
      tokens.push({ type: "and", value: "&&" });
      i += 2;
      continue;
    }

    if (input[i] === "|" && input[i + 1] === "|") {
      tokens.push({ type: "or", value: "||" });
      i += 2;
      continue;
    }

    if (input[i] === "|") {
      tokens.push({ type: "pipe", value: "|" });
      i++;
      continue;
    }

    if (input[i] === ";") {
      tokens.push({ type: "semi", value: ";" });
      i++;
      continue;
    }

    let word = "";
    while (i < input.length) {
      const ch = input[i];

      if (ch === " " || ch === "\t" || ch === "\n") break;
      if (ch === "|" || ch === "&" || ch === ";" || ch === ">" || ch === "<") break;
      if (ch === "2" && input.slice(i, i + 4) === "2>&1") break;

      if (ch === "\\") {
        i++;
        if (i < input.length) word += input[i++];
        continue;
      }

      // single quotes: no expansion
      if (ch === "'") {
        i++;
        while (i < input.length && input[i] !== "'") {
          word += input[i++];
        }
        if (i < input.length) i++;
        continue;
      }

      // double quotes: expand variables
      if (ch === '"') {
        i++;
        let dqContent = "";
        while (i < input.length && input[i] !== '"') {
          if (input[i] === "\\" && i + 1 < input.length) {
            const next = input[i + 1];
            if (next === '"' || next === "\\" || next === "$" || next === "`") {
              dqContent += next;
              i += 2;
              continue;
            }
          }
          dqContent += input[i++];
        }
        if (i < input.length) i++;
        word += expandVariables(dqContent, env, lastExit);
        continue;
      }

      word += ch;
      i++;
    }

    if (word.length > 0) {
      const expanded = expandVariables(word, env, lastExit);
      tokens.push({ type: "word", value: expanded });
    }
  }

  tokens.push({ type: "eof", value: "" });
  return tokens;
}

/* ------------------------------------------------------------------ */
/*  Recursive-descent parser                                           */
/* ------------------------------------------------------------------ */

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos] ?? { type: "eof", value: "" };
  }

  private advance(): Token {
    return this.tokens[this.pos++] ?? { type: "eof", value: "" };
  }

  private skipNewlines(): void {
    while (this.peek().type === "newline") this.advance();
  }

  parseList(): ListNode {
    this.skipNewlines();
    const entries: ListEntry[] = [];

    while (this.peek().type !== "eof") {
      this.skipNewlines();
      if (this.peek().type === "eof") break;

      const pipeline = this.parsePipeline();
      const op = this.peek();

      if (op.type === "and" || op.type === "or" || op.type === "semi") {
        this.advance();
        const operator: ListOperator =
          op.type === "and" ? "&&" : op.type === "or" ? "||" : ";";
        entries.push({ pipeline, next: operator });
      } else if (op.type === "newline") {
        // Newlines separate commands like ; in bash
        this.advance();
        this.skipNewlines();
        if (this.peek().type === "eof") {
          entries.push({ pipeline });
          break;
        }
        entries.push({ pipeline, next: ";" });
      } else {
        entries.push({ pipeline });
        break;
      }
    }

    return { kind: "list", entries };
  }

  private parsePipeline(): PipelineNode {
    const commands: CommandNode[] = [];
    commands.push(this.parseCommand());

    while (this.peek().type === "pipe") {
      this.advance();
      commands.push(this.parseCommand());
    }

    return { kind: "pipeline", commands };
  }

  private parseCommand(): CommandNode {
    const args: string[] = [];
    const redirects: RedirectNode[] = [];
    const assignments: Record<string, string> = {};

    // leading KEY=value assignments (only before any regular args)
    while (this.peek().type === "word") {
      const val = this.peek().value;
      const eqIdx = val.indexOf("=");
      if (eqIdx > 0 && args.length === 0 && /^[a-zA-Z_]/.test(val)) {
        this.advance();
        assignments[val.slice(0, eqIdx)] = val.slice(eqIdx + 1);
      } else {
        break;
      }
    }

    while (true) {
      const tok = this.peek();

      if (tok.type === "word") {
        this.advance();
        args.push(tok.value);
        continue;
      }

      if (tok.type === "redirect-out" || tok.type === "redirect-app" || tok.type === "redirect-in") {
        this.advance();
        const target = this.peek();
        if (target.type === "word") {
          this.advance();
          const rtype =
            tok.type === "redirect-out" ? "write" as const :
            tok.type === "redirect-app" ? "append" as const :
            "read" as const;
          redirects.push({ type: rtype, target: target.value });
        }
        continue;
      }

      if (tok.type === "redirect-2to1") {
        this.advance();
        redirects.push({ type: "stderr-to-stdout", target: "" });
        continue;
      }

      if (tok.type === "heredoc") {
        this.advance();
        redirects.push({ type: "heredoc", target: tok.value });
        continue;
      }

      break;
    }

    return { kind: "command", args, redirects, assignments };
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

// Glob expansion happens in the interpreter (needs volume access),
// but variable expansion and quoting are done here at tokenize time.
export function parse(
  input: string,
  env: Record<string, string>,
  lastExit: number = 0,
): ListNode {
  const tokens = tokenize(input, env, lastExit);
  const parser = new Parser(tokens);
  return parser.parseList();
}

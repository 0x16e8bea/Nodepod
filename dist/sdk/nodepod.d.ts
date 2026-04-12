import { MemoryVolume } from "../memory-volume";
import { DependencyInstaller } from "../packages/installer";
import { RequestProxy } from "../request-proxy";
import type { NodepodOptions, TerminalOptions, Snapshot, SnapshotOptions, SpawnOptions } from "./types";
import { NodepodFS } from "./nodepod-fs";
import { NodepodProcess } from "./nodepod-process";
import { NodepodTerminal } from "./nodepod-terminal";
import { ProcessManager } from "../threading/process-manager";
import { NodepodShell } from "../shell/shell-interpreter";
export interface MainThreadShellHandle {
    /** The shell interpreter running on the main thread. */
    shell: NodepodShell;
    /** Kill the active worker-delegated process (e.g. node server.js). No-op if idle. */
    killActiveProcess: () => void;
    /** Send stdin data to the active worker-delegated process. No-op if idle. */
    sendStdin: (data: string) => void;
    /**
     * Set callbacks for streaming output from worker-delegated commands.
     * Called before each terminal command; the terminal wiring uses this
     * to forward output in real-time instead of waiting for completion.
     */
    setOutputCallbacks: (cbs: {
        onStdout?: (data: string) => void;
        onStderr?: (data: string) => void;
    } | null) => void;
}
export declare class Nodepod {
    readonly fs: NodepodFS;
    private _volume;
    private _packages;
    private _proxy;
    private _cwd;
    private _processManager;
    private _vfsBridge;
    private _sharedVFS;
    private _syncChannel;
    private _unwatchVFS;
    private _handler;
    private constructor();
    static boot(opts?: NodepodOptions): Promise<Nodepod>;
    spawn(cmd: string, args?: string[], opts?: SpawnOptions): Promise<NodepodProcess>;
    private _resolveCommand;
    createTerminal(opts: TerminalOptions, mainThreadShell?: MainThreadShellHandle): NodepodTerminal;
    /**
     * Terminal backed by a main-thread NodepodShell.
     * Builtins run synchronously; worker-delegated commands (node, npm)
     * block until the worker process exits.
     */
    private _createTerminalWithMainThreadShell;
    /**
     * Terminal backed by a persistent shell worker (original behavior).
     */
    private _createTerminalWithWorker;
    /**
     * Create a shell interpreter that runs on the main thread, directly
     * against the real MemoryVolume. Builtins (cat, grep, ls, etc.) execute
     * synchronously with zero message-passing overhead. Commands that need
     * worker isolation (node, npm, npx, etc.) are automatically delegated
     * to workers via spawn().
     *
     * Use this when the shell needs direct access to main-thread state
     * (e.g. database connections, UI state, custom registered commands).
     */
    createMainThreadShell(opts?: {
        cwd?: string;
    }): MainThreadShellHandle;
    setPreviewScript(script: string): Promise<void>;
    clearPreviewScript(): Promise<void>;
    port(num: number): string | null;
    /** Directory names excluded from snapshots at any depth when shallow=true. */
    private static readonly SHALLOW_EXCLUDE_DIRS;
    snapshot(opts?: SnapshotOptions): Snapshot;
    restore(snapshot: Snapshot, opts?: SnapshotOptions): Promise<void>;
    teardown(): void;
    memoryStats(): {
        vfs: {
            fileCount: number;
            totalBytes: number;
            dirCount: number;
            watcherCount: number;
        };
        engine: {
            moduleCacheSize: number;
            transformCacheSize: number;
        };
        heap: {
            usedMB: number;
            totalMB: number;
            limitMB: number;
        } | null;
    };
    get volume(): MemoryVolume;
    /** @deprecated Main-thread engine removed for security. all code now runs in isolated Web Workers via spawn() <-- this removes fatal security flaws. */
    get engine(): never;
    get packages(): DependencyInstaller;
    get proxy(): RequestProxy;
    get processManager(): ProcessManager;
    get cwd(): string;
}

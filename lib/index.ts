import { AsyncLocalStorage } from "node:async_hooks";
import { format } from "node:util";

import ansi, { type Cursor } from "ansi";
const cursor = ansi(process.stdout, { enabled: true, buffering: false });

const COLORS = [
    // Blues
    (): Cursor => cursor.fg.rgb(0, 0, 215).bold(), // dark blue
    (): Cursor => cursor.fg.rgb(0, 0, 255).bold(), // blue
    (): Cursor => cursor.fg.rgb(0, 95, 215).bold(), // medium blue
    (): Cursor => cursor.fg.rgb(0, 95, 255).bold(), // bright medium blue
    (): Cursor => cursor.fg.rgb(0, 135, 215).bold(), // dodger blue
    (): Cursor => cursor.fg.rgb(0, 135, 255).bold(), // bright dodger blue
    (): Cursor => cursor.fg.rgb(0, 175, 215).bold(), // deep sky blue
    (): Cursor => cursor.fg.rgb(0, 175, 255).bold(), // bright sky blue

    // Greens / Teals
    (): Cursor => cursor.fg.rgb(0, 215, 0).bold(), // bright green
    (): Cursor => cursor.fg.rgb(0, 215, 95).bold(), // green-cyan
    (): Cursor => cursor.fg.rgb(0, 215, 135).bold(), // spring green
    (): Cursor => cursor.fg.rgb(0, 215, 175).bold(), // medium aquamarine
    (): Cursor => cursor.fg.rgb(0, 215, 215).bold(), // cyan
    (): Cursor => cursor.fg.rgb(0, 215, 255).bold(), // aqua

    // Purples
    (): Cursor => cursor.fg.rgb(95, 0, 215).bold(), // purple
    (): Cursor => cursor.fg.rgb(95, 0, 255).bold(), // blue-violet
    (): Cursor => cursor.fg.rgb(95, 95, 215).bold(), // medium purple
    (): Cursor => cursor.fg.rgb(95, 95, 255).bold(), // medium slate blue

    // Blue-greens
    (): Cursor => cursor.fg.rgb(95, 135, 215).bold(), // cornflower blue
    (): Cursor => cursor.fg.rgb(95, 135, 255).bold(), // light cornflower
    (): Cursor => cursor.fg.rgb(95, 175, 215).bold(), // steel blue
    (): Cursor => cursor.fg.rgb(95, 175, 255).bold(), // light steel blue
    (): Cursor => cursor.fg.rgb(95, 215, 0).bold(), // chartreuse
    (): Cursor => cursor.fg.rgb(95, 215, 95).bold(), // light green
    (): Cursor => cursor.fg.rgb(95, 215, 135).bold(), // light sea green
    (): Cursor => cursor.fg.rgb(95, 215, 175).bold(), // medium aquamarine
    (): Cursor => cursor.fg.rgb(95, 215, 215).bold(), // medium turquoise
    (): Cursor => cursor.fg.rgb(95, 215, 255).bold(), // light sky blue

    // Dark violet / orchid
    (): Cursor => cursor.fg.rgb(135, 0, 215).bold(), // dark violet
    (): Cursor => cursor.fg.rgb(135, 0, 255).bold(), // blue-violet
    (): Cursor => cursor.fg.rgb(135, 95, 215).bold(), // medium purple
    (): Cursor => cursor.fg.rgb(135, 95, 255).bold(), // light slate blue

    // Yellow-greens
    (): Cursor => cursor.fg.rgb(135, 215, 0).bold(), // yellow-green
    (): Cursor => cursor.fg.rgb(135, 215, 95).bold(), // light yellow-green

    // Magentas / orchids
    (): Cursor => cursor.fg.rgb(175, 0, 215).bold(), // dark magenta
    (): Cursor => cursor.fg.rgb(175, 0, 255).bold(), // purple
    (): Cursor => cursor.fg.rgb(175, 95, 215).bold(), // medium orchid
    (): Cursor => cursor.fg.rgb(175, 95, 255).bold(), // light medium orchid
    (): Cursor => cursor.fg.rgb(175, 215, 0).bold(), // yellow-green
    (): Cursor => cursor.fg.rgb(175, 215, 95).bold(), // light yellow-green

    // Reds / pinks
    (): Cursor => cursor.fg.rgb(215, 0, 0).bold(), // red
    (): Cursor => cursor.fg.rgb(215, 0, 95).bold(), // crimson
    (): Cursor => cursor.fg.rgb(215, 0, 135).bold(), // deep pink
    (): Cursor => cursor.fg.rgb(215, 0, 175).bold(), // magenta-pink
    (): Cursor => cursor.fg.rgb(215, 0, 215).bold(), // magenta
    (): Cursor => cursor.fg.rgb(215, 0, 255).bold(), // magenta-violet
    (): Cursor => cursor.fg.rgb(215, 95, 0).bold(), // dark orange
    (): Cursor => cursor.fg.rgb(215, 95, 95).bold(), // indian red
    (): Cursor => cursor.fg.rgb(215, 95, 135).bold(), // pale violet red
    (): Cursor => cursor.fg.rgb(215, 95, 175).bold(), // orchid
    (): Cursor => cursor.fg.rgb(215, 95, 215).bold(), // violet
    (): Cursor => cursor.fg.rgb(215, 95, 255).bold(), // medium orchid

    // Oranges / golds
    (): Cursor => cursor.fg.rgb(215, 135, 0).bold(), // dark goldenrod
    (): Cursor => cursor.fg.rgb(215, 135, 95).bold(), // sandy brown
    (): Cursor => cursor.fg.rgb(215, 175, 0).bold(), // goldenrod
    (): Cursor => cursor.fg.rgb(215, 175, 95).bold(), // dark khaki
    (): Cursor => cursor.fg.rgb(215, 215, 0).bold(), // yellow
    (): Cursor => cursor.fg.rgb(215, 215, 95).bold(), // light yellow

    // Bright reds / pinks
    (): Cursor => cursor.fg.rgb(255, 0, 0).bold(), // bright red
    (): Cursor => cursor.fg.rgb(255, 0, 95).bold(), // rose
    (): Cursor => cursor.fg.rgb(255, 0, 135).bold(), // hot pink
    (): Cursor => cursor.fg.rgb(255, 0, 175).bold(), // deep pink
    (): Cursor => cursor.fg.rgb(255, 0, 215).bold(), // bright magenta
    (): Cursor => cursor.fg.rgb(255, 0, 255).bold(), // fuchsia
    (): Cursor => cursor.fg.rgb(255, 95, 0).bold(), // orange-red
    (): Cursor => cursor.fg.rgb(255, 95, 95).bold(), // salmon
    (): Cursor => cursor.fg.rgb(255, 95, 135).bold(), // light coral
    (): Cursor => cursor.fg.rgb(255, 95, 175).bold(), // pink
    (): Cursor => cursor.fg.rgb(255, 95, 215).bold(), // orchid
    (): Cursor => cursor.fg.rgb(255, 95, 255).bold(), // violet

    // Bright oranges
    (): Cursor => cursor.fg.rgb(255, 135, 0).bold(), // dark orange
    (): Cursor => cursor.fg.rgb(255, 135, 95).bold(), // light salmon
    (): Cursor => cursor.fg.rgb(255, 175, 0).bold(), // orange / gold
    (): Cursor => cursor.fg.rgb(255, 175, 95).bold(), // sandy brown

    // Yellows
    (): Cursor => cursor.fg.rgb(255, 215, 0).bold(), // gold
    (): Cursor => cursor.fg.rgb(255, 215, 95).bold(), // light goldenrod
];

function humanize(ns: bigint): string {
    const ms = Number(ns) / 1e6;
    if (ms < 1000) return `${ms < 10 ? ms.toFixed(1) : Math.round(ms)}ms`;
    if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.round(ms / 60_000)}m`;
}

function parseEnv(input: string): { names: Array<RegExp>; skips: Array<RegExp> } {
    const names: Array<RegExp> = [];
    const skips: Array<RegExp> = [];
    for (const part of input.split(/[\s,]+/).filter(Boolean)) {
        if (part.startsWith("-")) {
            skips.push(new RegExp(`^${part.slice(1).replace(/\*/g, ".*?")}$`));
        } else {
            names.push(new RegExp(`^${part.replace(/\*/g, ".*?")}$`));
        }
    }
    return { names, skips };
}

const { names, skips } = parseEnv(process.env.LOGGER ?? "*");

function isEnabled(namespace: string): boolean {
    if (skips.some(re => re.test(namespace))) return false;
    return names.some(re => re.test(namespace));
}

let rootNamespace: string | undefined;

// Sets a namespace prepended (as `root:...`) to every namespace passed to `Debug()` — including
// for the `LOGGER` enabled/skipped check, so filters should target the prefixed form (e.g.
// `LOGGER=root:*`). Pass `undefined` to clear it.
export function setRootNamespace(namespace: string | undefined): void {
    rootNamespace = namespace;
}

export function getRootNamespace(): string | undefined {
    return rootNamespace;
}

interface LogContext {
    colorIndex: number;
    lastHrTime: bigint;
    namespace?: string;
    startHrTime: bigint;
}

const storage = new AsyncLocalStorage<LogContext>();
let contextIndex = 0;

// Joins whichever of the root namespace, the current context's namespace, and `namespace` itself
// are present, in that order, e.g. root `a` + context `b` + `Debug("c", ...)` => `a:b:c`.
function fullNamespace(namespace: string | null): string {
    const ctx = storage.getStore();
    return [rootNamespace, ctx?.namespace, namespace ?? undefined]
        .filter((part): part is string => Boolean(part))
        .join(":");
}

// Runs `fn` (sync or async) with a shared color and start time stashed in AsyncLocalStorage, so
// every call to the default export made anywhere in its call chain — regardless of namespace —
// shares one color and reports how long it's been since this scope started, plus how long since
// the previous call within it. An optional leading `namespace` is stashed on the context as-is,
// and prepended (after the root namespace, if any) to every `Debug()` call made within `fn`.
export function withContext<T>(fn: () => T): T;
export function withContext<T>(namespace: string, fn: () => T): T;
export function withContext<T>(namespaceOrFn: string | (() => T), fn?: () => T): T {
    const namespace = typeof namespaceOrFn === "string" ? namespaceOrFn : undefined;
    const run = typeof namespaceOrFn === "string" ? fn! : namespaceOrFn;
    const colorIndex = contextIndex++ % COLORS.length;
    const now = process.hrtime.bigint();
    return storage.run({ startHrTime: now, lastHrTime: now, colorIndex, namespace }, run);
}

// Same as `withContext(namespace, fn)`, but `namespace` is required rather than optional.
export function namespaced<T>(namespace: string, fn: () => T): T {
    return withContext(namespace, fn);
}

export default function Debug(namespace: string | null, formatter: unknown, ...args: Array<unknown>): void {
    const ns = fullNamespace(namespace);
    if (!isEnabled(ns)) return;

    const now = process.hrtime.bigint();
    const ctx = storage.getStore();
    const message = format(formatter, ...args);
    const color = (ctx?.colorIndex !== undefined ? COLORS[ctx.colorIndex] : COLORS[contextIndex++ % COLORS.length])!;

    if (ctx) {
        const total = humanize(now - ctx.startHrTime);
        color().write(ns).reset();
        cursor.write(` ${message} `);
        color().write(total).reset();
        if (ctx.startHrTime !== ctx.lastHrTime) {
            const since = humanize(now - ctx.lastHrTime);
            cursor.write("/");
            color().write(`+${since}`).reset();
        }
        ctx.lastHrTime = now;
        cursor.write("\n");
    } else {
        color().write(ns).reset();
        cursor.write(` ${message}\n`);
    }
}

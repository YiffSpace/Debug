# Debug
A colorized, namespace-based console logger with `AsyncLocalStorage`-backed timing. Filtering is
controlled by the `LOGGER` environment variable (glob-style, comma/space separated, `-` prefix to
exclude — same syntax as the `debug` package's `DEBUG` var), e.g. `LOGGER=app:*,-app:noisy`.

## Installation

```bash
pnpm add @yiffy/debug
```

## Usage

```ts
import Debug, { withContext } from "@yiffy/debug";

await withContext(async () => {
    Debug("app:one", "starting");
    await doSomething();
    Debug("app:two", "done with the first step");
});
```

Each line is namespace + message + running total since the scope started; a second line within
the same scope also gets a `/+Nms` delta since the previous line:

```
app:one starting 0.3ms
app:two done with the first step 42.1ms/+41.8ms
```

Every call within one `withContext()` scope shares a single (randomly assigned) color, making it
easy to visually group related log lines even when they interleave with other concurrent scopes.
Calls to `Debug()` outside of a `withContext()` scope still print (colored by namespace) but with
no timing.

The root namespace, the current `withContext()`/`namespaced()` scope's namespace (if any), and
`Debug()`'s own namespace are all joined with `:`, in that order — root `a` + context `b` +
`Debug("c", ...)` prints under `a:b:c`. `Debug()`'s namespace is nullable — pass `null` to omit
that last segment and log under just the root/context namespace:

```ts
setRootNamespace("a");
namespaced("b", () => {
    Debug("c", "hi"); // a:b:c hi
    Debug(null, "hi"); // a:b hi
});
```

### API

- `Debug(namespace, formatter, ...args)` (default export) — logs under the joined
  root/context/own namespace (see above) if enabled by `LOGGER`. `namespace` may be `null` to omit
  its own segment.
- `withContext(fn)` / `withContext(namespace, fn)` — runs `fn` (sync or async) with a shared color
  and start time, so `Debug()` calls made anywhere in its call chain report elapsed time. The
  optional leading `namespace` is prepended to every `Debug()` call made within `fn` (after the
  root namespace, if any).
- `namespaced(namespace, fn)` — same as `withContext(namespace, fn)`, but `namespace` is required
  rather than optional.
- `setRootNamespace(namespace)` / `getRootNamespace()` — sets (or clears, with `undefined`) a
  namespace prepended to every namespace passed to `Debug()` — including for the `LOGGER` filter,
  so target the prefixed form (e.g. `LOGGER=myapp:*`).

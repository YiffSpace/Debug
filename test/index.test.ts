import assert from "node:assert/strict";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";

import Debug, { getRootNamespace, namespaced, setRootNamespace, withContext } from "../lib/index.ts";

function stripAnsi(input: string): string {
    // eslint-disable-next-line no-control-regex
    return input.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

function capture(fn: () => void): string {
    const chunks: Array<string> = [];
    const original = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk: string | Uint8Array): boolean => {
        chunks.push(chunk.toString());
        return true;
    };
    try {
        fn();
    } finally {
        process.stdout.write = original;
    }
    return stripAnsi(chunks.join(""));
}

void test("logs without a withContext() scope carry no elapsed time", () => {
    const line = capture(() => { Debug("test:bare", "hello"); });
    assert.match(line, /hello/);
    assert.doesNotMatch(line, /hello \d/);
});

void test("logs inside withContext(fn) report total elapsed time since the scope started", async () => {
    let line = "";
    await withContext(async () => {
        await delay(10);
        line = capture(() => { Debug("test:timed", "world"); });
    });
    assert.match(line, /world \d+(\.\d+)?ms/);
});

void test("a second call within the same withContext(fn) scope also reports time since the previous call", async () => {
    let line = "";
    await withContext(async () => {
        Debug("test:first", "one");
        await delay(10);
        line = capture(() => { Debug("test:second", "two"); });
    });
    assert.match(line, /two \d+(\.\d+)?ms\/\+\d+(\.\d+)?ms/);
});

void test("withContext(namespace, fn) behaves the same as withContext(fn)", async () => {
    let line = "";
    await withContext("test:scope", async () => {
        await delay(10);
        line = capture(() => { Debug("test:timed", "world"); });
    });
    assert.match(line, /world \d+(\.\d+)?ms/);
});

void test("namespaced(namespace, fn) delegates to withContext", async () => {
    let line = "";
    await namespaced("test:scope", async () => {
        await delay(10);
        line = capture(() => { Debug("test:timed", "world"); });
    });
    assert.match(line, /world \d+(\.\d+)?ms/);
});

void test("setRootNamespace() prepends the root namespace to plain Debug() calls", () => {
    assert.equal(getRootNamespace(), undefined);
    setRootNamespace("root");
    try {
        const line = capture(() => { Debug("test:bare", "hello"); });
        assert.match(line, /^root:test:bare hello/);
    } finally {
        setRootNamespace(undefined);
    }
});

void test("setRootNamespace() also prepends inside a withContext()/namespaced() scope with no namespace of its own", async () => {
    setRootNamespace("root");
    try {
        let plain = "";
        await withContext(async () => {
            plain = capture(() => { Debug("test:timed", "hi"); });
        });
        assert.match(plain, /^root:test:timed hi/);
    } finally {
        setRootNamespace(undefined);
    }
});

void test("root namespace + context namespace + Debug()'s own namespace are all joined, in that order", () => {
    setRootNamespace("a");
    try {
        let line = "";
        namespaced("b", () => {
            line = capture(() => { Debug("c", "hi"); });
        });
        assert.match(line, /^a:b:c hi/);
    } finally {
        setRootNamespace(undefined);
    }
});

void test("Debug(null, ...) omits its own namespace segment, but keeps root and context", () => {
    setRootNamespace("a");
    try {
        let line = "";
        namespaced("b", () => {
            line = capture(() => { Debug(null, "hi"); });
        });
        assert.match(line, /^a:b hi/);
    } finally {
        setRootNamespace(undefined);
    }
});

// Vitest global setup, executed before each test file.
// The Angular Vitest builder (`@angular/build:unit-test`) initializes
// polyfills and TestBed automatically, so this file is only for our own
// global polyfills / patches.

// jsdom does not expose Node 17+ built-ins like structuredClone on the
// global scope. Provide a JSON-based fallback so tests that rely on it
// keep working.
globalThis.structuredClone =
    globalThis.structuredClone ?? ((value: unknown) => JSON.parse(JSON.stringify(value)) as unknown);

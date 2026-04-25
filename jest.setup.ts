import {setupZonelessTestEnv} from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();

// jest-environment-jsdom replaces the Node.js global with jsdom's window,
// which does not expose Node 17+ built-ins like structuredClone automatically.
global.structuredClone = global.structuredClone ?? ((obj: unknown) => JSON.parse(JSON.stringify(obj)));

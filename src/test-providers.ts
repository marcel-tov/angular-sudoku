import {provideZonelessChangeDetection, type EnvironmentProviders, type Provider} from '@angular/core';

// Default Angular providers installed into TestBed by the Vitest builder
// before each spec runs. Mirrors the zoneless setup we used to get from
// `jest-preset-angular/setup-env/zoneless`.
const providers: Array<Provider | EnvironmentProviders> = [
    provideZonelessChangeDetection(),
];

export default providers;

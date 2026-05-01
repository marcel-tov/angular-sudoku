import {InjectionToken} from '@angular/core';
import {firebaseConfig} from './firebase.config';

// Required keys that must be present for the Firebase AI scan feature to work.
const requiredKeys: ReadonlyArray<keyof typeof firebaseConfig> = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
];

const computeIsFirebaseConfigured = (): boolean => {
    const configured: boolean = requiredKeys.every(
        (key: keyof typeof firebaseConfig): boolean => Boolean(firebaseConfig[key]),
    );

    if (!configured) {
        console.warn(
            '[firebase] No Firebase configuration found — the sudoku scan feature is disabled. ' +
            'Set FIREBASE_* environment variables at build time to enable it.',
        );
    }

    return configured;
};

// Whether the Firebase AI scan feature has the configuration it needs to run.
// Exposed as an InjectionToken so tests can override it via TestBed providers
// (the Angular Vitest builder doesn't allow `vi.mock` for relative source modules).
const FIREBASE_CONFIGURED: InjectionToken<boolean> = new InjectionToken<boolean>('FIREBASE_CONFIGURED', {
    providedIn: 'root',
    factory: computeIsFirebaseConfigured,
});

export {FIREBASE_CONFIGURED};

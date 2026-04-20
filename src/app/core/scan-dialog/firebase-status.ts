import {firebaseConfig} from './firebase.config';

// Required keys that must be present for the Firebase AI scan feature to work.
const requiredKeys: ReadonlyArray<keyof typeof firebaseConfig> = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
];

const isFirebaseConfigured: boolean = requiredKeys.every(
    (key: keyof typeof firebaseConfig): boolean => Boolean(firebaseConfig[key]),
);

if (!isFirebaseConfigured) {
    console.warn(
        '[firebase] No Firebase configuration found — the sudoku scan feature is disabled. ' +
        'Set FIREBASE_* environment variables at build time to enable it.',
    );
}

export {isFirebaseConfigured};

# Angular Sudoku

A Sudoku game built with Angular and Angular Material.

## Tech Stack

- **Angular 21** — framework
- **Angular Material** — UI components (Material Design 3 theming)
- **Vitest** — unit & component testing (via the `@angular/build:unit-test` builder)
- **Cypress** — end-to-end & component testing
- **ESLint** — linting (with Angular, TypeScript, Vitest, and Cypress plugins)
- **stylelint** — SCSS linting
- **semantic-release** — automated versioning and changelog generation

## Prerequisites

- Node.js (check `.nvmrc` or `engines` field if present)
- npm

## Installation

```bash
npm install
```

## Development

### Start the dev server

```bash
npm start
```

Runs `ng serve`. Open [http://localhost:4200](http://localhost:4200) in your browser. The app reloads automatically on file changes.

### Build

```bash
npm run build
```

Build artifacts are output to the `dist/` directory.

## Testing

### Unit tests (Vitest)

```bash
npm run test          # run all tests once (watch auto-detected from TTY)
npm run test:watch    # watch mode — re-runs tests on file changes
npm run test:ci       # CI mode — runs tests once with coverage and no watch
```

Tests run in jsdom via the Angular CLI's `@angular/build:unit-test` builder. Coverage is collected with `@vitest/coverage-v8` and reported as `lcov`, `text-summary`, and `html` under `coverage/`.

### End-to-end tests (Cypress)

The dev server must be running (`npm start`) before running E2E tests.

```bash
npm run cypress:e2e            # run E2E tests in Chrome
npm run cypress:e2e:firefox    # run E2E tests in Firefox
npm run cypress:run            # run all Cypress specs headlessly
npm run cypress:open           # open Cypress interactive test runner
```

### Component tests (Cypress)

```bash
npm run cypress:component      # run Cypress component tests
```

## Linting & Formatting

```bash
npm run lint        # run eslint + stylelint (errors only)
npm run fmt         # auto-fix eslint and stylelint issues
npm run eslint      # eslint on JS/TS/HTML files
npm run stylelint   # stylelint on SCSS files
```

ESLint runs with plugins for Angular, TypeScript, Vitest, and Cypress. Stylelint extends `stylelint-config-recommended-scss`. Both are wired into CI as separate jobs.

## Releasing

Releases are fully automated via **semantic-release** following the [Angular commit message convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit). The version bump, changelog, and npm publish are all derived from commit messages.

```bash
npm run semantic-release
```

Commit types that trigger a release:

| Type | Release |
|------|---------|
| `fix:` | Patch (e.g. `1.0.0` → `1.0.1`) |
| `feat:` | Minor (e.g. `1.0.0` → `1.1.0`) |
| `BREAKING CHANGE` in footer | Major (e.g. `1.0.0` → `2.0.0`) |

## Contributing

This project follows [Angular's commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit). Please use conventional commit messages (e.g. `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`) so that semantic-release can correctly determine version bumps and generate the changelog.

## Project Structure

```
src/
├── app/
│   ├── core/         # core services and utilities
│   ├── pages/        # routed page components
│   └── app.module.ts
├── assets/
├── environments/
└── styles/
```

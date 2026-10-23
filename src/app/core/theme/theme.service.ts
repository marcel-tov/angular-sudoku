import {
    DOCUMENT, Injectable, Signal, WritableSignal, computed, effect, inject, signal,
} from '@angular/core';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY: string = 'theme';
const DARK_THEME_CLASS: string = 'dark-theme';

/**
 * Holds the active color theme. The initial value is the stored user choice,
 * falling back to the OS preference (`prefers-color-scheme`). Every change is
 * reflected as a class on <html> (which flips the M3 `color-scheme` tokens)
 * and persisted to localStorage.
 */
@Injectable({providedIn: 'root'})
class ThemeService {
    public readonly isDark: Signal<boolean> = computed(() => this.theme() === 'dark');

    private readonly document: Document = inject(DOCUMENT);
    private readonly theme: WritableSignal<Theme> = signal<Theme>(this.getInitialTheme());

    constructor() {
        effect(() => {
            const theme: Theme = this.theme();
            this.document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === 'dark');
            try {
                this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
            } catch {
                // storage may be unavailable (e.g. private mode) — theme still applies for this session
            }
        });
    }

    public toggle(): void {
        this.theme.update((theme: Theme) => theme === 'dark' ? 'light' : 'dark');
    }

    private getInitialTheme(): Theme {
        const view: (Window & typeof globalThis) | null = this.document.defaultView;
        try {
            const stored: string | null | undefined = view?.localStorage.getItem(THEME_STORAGE_KEY);
            if (stored === 'light' || stored === 'dark') {
                return stored;
            }
        } catch {
            // ignore unavailable storage
        }

        return view?.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

export {ThemeService, THEME_STORAGE_KEY, DARK_THEME_CLASS};
export type {Theme};

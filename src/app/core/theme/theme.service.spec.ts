import {TestBed} from '@angular/core/testing';
import {DARK_THEME_CLASS, THEME_STORAGE_KEY, ThemeService} from './theme.service';

describe('ThemeService', () => {
    const create = (): ThemeService => {
        const service: ThemeService = TestBed.inject(ThemeService);
        TestBed.tick();

        return service;
    };

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove(DARK_THEME_CLASS);
    });

    it('should default to light when nothing is stored and OS prefers light', () => {
        const service: ThemeService = create();
        expect(service.isDark()).toBe(false);
        expect(document.documentElement.classList.contains(DARK_THEME_CLASS)).toBe(false);
    });

    it('should restore a stored dark theme', () => {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
        const service: ThemeService = create();
        expect(service.isDark()).toBe(true);
        expect(document.documentElement.classList.contains(DARK_THEME_CLASS)).toBe(true);
    });

    it('should toggle the theme, update <html> and persist the choice', () => {
        const service: ThemeService = create();

        service.toggle();
        TestBed.tick();
        expect(service.isDark()).toBe(true);
        expect(document.documentElement.classList.contains(DARK_THEME_CLASS)).toBe(true);
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

        service.toggle();
        TestBed.tick();
        expect(service.isDark()).toBe(false);
        expect(document.documentElement.classList.contains(DARK_THEME_CLASS)).toBe(false);
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });
});

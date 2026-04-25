let mockedIsFirebaseConfigured: boolean = true;

jest.mock('../scan-dialog/firebase-status', () => ({
    get isFirebaseConfigured(): boolean {
        return mockedIsFirebaseConfigured;
    },
}));

import {GridTopNavigationComponent} from './grid-top-navigation.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';

describe('GridTopNavigationComponent', () => {
    let spectator: Spectator<GridTopNavigationComponent>;
    const createComponent: SpectatorFactory<GridTopNavigationComponent> = createComponentFactory({
        component: GridTopNavigationComponent,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => {
        mockedIsFirebaseConfigured = true;
    });

    it('Does show container', () => {
        spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
        spectator.detectChanges();
        expect(spectator.query('div')).toHaveClass('grid-top-navigation');
    });

    it('Does display time', () => {
        spectator = createComponent({props: {lockValues: true, time: '01:23:45'}});
        spectator.detectChanges();
        expect(spectator.element).toHaveText('01:23:45');
    });

    it('Does emit share on share button click', () => {
        spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
        const shareSpy: jest.SpyInstance = jest.spyOn(spectator.component.share, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('share', {selector: 'button'});
        spectator.click(selector);
        expect(shareSpy).toHaveBeenCalledWith();
    });

    it('Does emit create on create button click', () => {
        spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
        const createSpy: jest.SpyInstance = jest.spyOn(spectator.component.create, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('autorenew', {selector: 'button'});
        spectator.click(selector);
        expect(createSpy).toHaveBeenCalledWith();
    });

    it('Does not show clear all button when lockValues is true', () => {
        spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Clear all values"]')).toBeNull();
    });

    it('Does show clear all button when lockValues is false', () => {
        spectator = createComponent({props: {lockValues: false, time: '00:00:00'}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Clear all values"]')).not.toBeNull();
    });

    it('Does emit clearAll on clear all button click', () => {
        spectator = createComponent({props: {lockValues: false, time: '00:00:00'}});
        const clearAllSpy: jest.SpyInstance = jest.spyOn(spectator.component.clearAll, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('clear_all', {selector: 'button'});
        spectator.click(selector);
        expect(clearAllSpy).toHaveBeenCalledWith();
    });

    it('Does show lock icon when lockValues is true', () => {
        spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Make locked fields editable"]')).toHaveText('lock');
    });

    it('Does show lock_open icon when lockValues is false', () => {
        spectator = createComponent({props: {lockValues: false, time: '00:00:00'}});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Make locked fields editable"]')).toHaveText('lock_open');
    });

    it('Does emit lockValuesChange on lock button click', () => {
        spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
        const lockSpy: jest.SpyInstance = jest.spyOn(spectator.component.lockValuesChange, 'emit');
        spectator.detectChanges();
        spectator.click('button[aria-label="Make locked fields editable"]');
        expect(lockSpy).toHaveBeenCalledWith();
    });

    describe('scan button', () => {
        it('Does show scan button when Firebase is configured', () => {
            mockedIsFirebaseConfigured = true;
            spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
            spectator.detectChanges();
            expect(spectator.query('button[aria-label="Scan sudoku from camera"]')).not.toBeNull();
        });

        it('Does hide scan button when Firebase is not configured', () => {
            mockedIsFirebaseConfigured = false;
            spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
            spectator.detectChanges();
            expect(spectator.query('button[aria-label="Scan sudoku from camera"]')).toBeNull();
        });

        it('Does emit scan on scan button click when Firebase is configured', () => {
            mockedIsFirebaseConfigured = true;
            spectator = createComponent({props: {lockValues: true, time: '00:00:00'}});
            const scanSpy: jest.SpyInstance = jest.spyOn(spectator.component.scan, 'emit');
            spectator.detectChanges();
            const selector: DOMSelector = byTextContent('photo_camera', {selector: 'button'});
            spectator.click(selector);
            expect(scanSpy).toHaveBeenCalledWith();
        });
    });
});

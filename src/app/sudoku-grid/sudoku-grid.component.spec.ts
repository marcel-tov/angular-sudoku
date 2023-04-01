
import {SudokuGridComponent} from './sudoku-grid.component';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent, DOMSelector} from '@ngneat/spectator';
import {
    MatLegacyDialogModule as MatDialogModule,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

describe('SudokuGridComponent', () => {
    let spectator: Spectator<SudokuGridComponent>;
    const createComponent: SpectatorFactory<SudokuGridComponent> = createComponentFactory({
        component: SudokuGridComponent,
        imports: [
            MatDialogModule,
        ],
        mocks: [
            MatDialogRef,
        ],
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('Does show grid container', () => {
        spectator.detectChanges();
        expect(spectator.query('div')).toHaveClass('sudoku-grid');
    });

    it('Does show top navigation', () => {
        spectator.setInput({showTopNavigation: false, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.sudoku-grid')).not.toHaveDescendant('.sudoku-grid__navigation');

        spectator.setInput({showTopNavigation: true, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.sudoku-grid')).toHaveDescendant('.sudoku-grid__navigation');
    });

    it('Does show footer navigation', () => {
        spectator.setInput({showTopNavigation: false, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.sudoku-grid')).not.toHaveDescendant('.sudoku-grid__navigation');

        spectator.setInput({showTopNavigation: false, showFooterNavigation: true});
        spectator.detectChanges();
        expect(spectator.query('div.sudoku-grid')).toHaveDescendant('.sudoku-grid__navigation');
    });

    it('On share button does share grid', () => {
        const shareSpy: jasmine.Spy = spyOn(spectator.component.share, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('share', {selector: 'button'});
        spectator.click(selector);
        expect(shareSpy).toHaveBeenCalledWith(spectator.component.originalGrid);
    });

    it('On create button does create grid', () => {
        const createSpy: jasmine.Spy = spyOn(spectator.component.create, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('autorenew', {selector: 'button'});
        spectator.click(selector);
        expect(createSpy).toHaveBeenCalledWith();
    });

    it('On click lock button changes lock value', () => {
        spectator.detectChanges();
        expect(spectator.component.lockValues).toBe(true);
        spectator.click(byTextContent('lock', {selector: 'button'}));
        expect(spectator.component.lockValues).toBe(false);
        spectator.click(byTextContent('lock_open', {selector: 'button'}));
        expect(spectator.component.lockValues).toBe(true);
    });

    it('On click nominees button changes nominees value', () => {
        spectator.detectChanges();
        expect(spectator.component.showNominees).toBe(false);
        spectator.click(byTextContent('Nominees', {selector: 'button'}));
        expect(spectator.component.showNominees).toBe(true);
        spectator.click(byTextContent('Nominees', {selector: 'button'}));
        expect(spectator.component.showNominees).toBe(false);
    });
});

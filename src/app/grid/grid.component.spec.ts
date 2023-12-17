
import {getEmptyRow, SudokuGrid, GridComponent} from './grid.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';

describe('SudokuGridComponent', () => {
    const grid: SudokuGrid = [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
    let spectator: Spectator<GridComponent>;
    const createComponent: SpectatorFactory<GridComponent> = createComponentFactory({
        component: GridComponent,
        imports: [
            MatDialogModule,
        ],
        mocks: [
            MatDialogRef,
        ],
        declareComponent: false,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('Does show grid container', () => {
        spectator.detectChanges();
        expect(spectator.query('div')).toHaveClass('grid');
    });

    it('Does show top navigation', () => {
        spectator.setInput({showTopNavigation: false, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).not.toHaveDescendant('.grid__navigation');

        spectator.setInput({showTopNavigation: true, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).toHaveDescendant('.grid__navigation');
    });

    it('Does show footer navigation', () => {
        spectator.setInput({showTopNavigation: false, showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).not.toHaveDescendant('.grid__navigation');

        spectator.setInput({showTopNavigation: false, showFooterNavigation: true});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).toHaveDescendant('.grid__navigation');
    });

    it('On share button does share grid', () => {
        const shareSpy: jest.SpyInstance = jest.spyOn(spectator.component.share, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('share', {selector: 'button'});
        spectator.click(selector);
        expect(shareSpy).toHaveBeenCalledWith(spectator.component.originalGrid);
    });

    it('On create button does create grid', () => {
        const createSpy: jest.SpyInstance = jest.spyOn(spectator.component.create, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('autorenew', {selector: 'button'});
        spectator.click(selector);
        expect(createSpy).toHaveBeenCalledWith();
    });

    it('On click lock button changes lock value', () => {
        spectator.setInput('originalGrid', grid);
        spectator.detectChanges();
        expect(spectator.component.lockValues).toBe(true);
        spectator.click(byTextContent('lock', {selector: 'button'}));
        expect(spectator.component.lockValues).toBe(false);
        spectator.click(byTextContent('lock_open', {selector: 'button'}));
        expect(spectator.component.lockValues).toBe(true);
    });

    // it('On click nominees button changes nominees value', () => {
    //     spectator.setInput('originalGrid', grid);
    //     spectator.detectChanges();
    //     expect(spectator.component.showNominees).toBe(false);
    //     spectator.click(byTextContent('Nominees', {selector: 'button'}));
    //     expect(spectator.component.showNominees).toBe(true);
    //     spectator.click(byTextContent('Nominees', {selector: 'button'}));
    //     expect(spectator.component.showNominees).toBe(false);
    // });
});


import {GridComponent} from './grid.component';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import {SudokuGrid} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';

describe('GridComponent', () => {
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

    beforeEach(() => {
        spectator = createComponent();
        jest.useFakeTimers({
            legacyFakeTimers: true,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('Does show grid container', () => {
        spectator.detectChanges();
        expect(spectator.query('div')).toHaveClass('grid');
    });

    it('Does show footer navigation', () => {
        spectator.setInput({showFooterNavigation: false});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).not.toHaveDescendant('.grid__navigation');

        spectator.setInput({showFooterNavigation: true});
        spectator.detectChanges();
        expect(spectator.query('div.grid')).toHaveDescendant('.grid__navigation');
    });

    it('On click nominees button changes nominees value', () => {
        spectator.setInput('originalGrid', grid);
        spectator.detectChanges();
        expect(spectator.component.showNominees).toBe(false);
        spectator.click(byTextContent('Nominees', {selector: 'button'}));
        expect(spectator.component.showNominees).toBe(true);
        spectator.click(byTextContent('Nominees', {selector: 'button'}));
        expect(spectator.component.showNominees).toBe(false);
    });
});

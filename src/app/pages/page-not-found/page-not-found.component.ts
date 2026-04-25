import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GridComponent} from '../../core/grid/grid.component';
import {SudokuGrid, SudokuValue} from '../../core/grid-helper/types';
import {getEmptyRow} from '../../core/grid-helper/empty-row';

@Component({
    selector: 'page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        GridComponent,
    ],
})
export class PageNotFoundComponent {
    protected readonly sudokuGrid: SudokuGrid = [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        // Spells "404" using the 4-0-4 cells — not a valid sudoku, decoration only.
        [null, 4, null, null, 0 as unknown as SudokuValue, null, null, 4, null],
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
}

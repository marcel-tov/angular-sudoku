import {ChangeDetectionStrategy, Component} from '@angular/core';
import {getEmptyRow, SudokuGrid, SudokuGridComponent} from '../sudoku-grid/sudoku-grid.component';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SudokuGridComponent,
    ],
})
export class PageNotFoundComponent {
    public sudokuGrid: SudokuGrid = [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        [null, 4, null, null, 0, null, null, 4, null],
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
}

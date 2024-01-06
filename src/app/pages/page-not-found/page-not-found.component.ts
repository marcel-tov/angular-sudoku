import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GridComponent} from '../../grid/grid.component';
import {SudokuGrid} from '../../grid-helper/types';
import {getEmptyRow} from '../../grid-helper/empty-row';

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
        [null, 4, null, null, 0, null, null, 4, null],
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
}

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GridComponent} from '../../core/grid/grid.component';
import {SudokuGrid} from '../../core/grid-helper/types';
import {getEmptyRow} from '../../core/grid-helper/empty-row';
import {GridService} from '../../core/grid/grid.service';

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

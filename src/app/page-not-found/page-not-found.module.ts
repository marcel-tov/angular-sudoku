import {NgModule} from '@angular/core';
import {SudokuGridComponent} from '../sudoku-grid/sudoku-grid.component';
import {PageNotFoundComponent} from './page-not-found.component';

@NgModule({
    declarations: [
        PageNotFoundComponent,
    ],
    exports: [
        PageNotFoundComponent,
    ],
    imports: [
      SudokuGridComponent,
    ],
})
export class PageNotFoundModule { }

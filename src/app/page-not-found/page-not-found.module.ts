import {NgModule} from '@angular/core';
import {SudokuGridModule} from '../sudoku-grid/sudoku-grid.module';
import {PageNotFoundComponent} from './page-not-found.component';

@NgModule({
    declarations: [
        PageNotFoundComponent,
    ],
    exports: [
        PageNotFoundComponent,
    ],
    imports: [
        SudokuGridModule,
    ],
})
export class PageNotFoundModule { }

import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
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
        FlexLayoutModule,
        SudokuGridModule,
    ],
})
export class PageNotFoundModule { }

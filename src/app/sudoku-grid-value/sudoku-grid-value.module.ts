import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SudokuGridValueComponent} from './sudoku-grid-value.component';

@NgModule({
    declarations: [
        SudokuGridValueComponent,
    ],
    exports: [
        SudokuGridValueComponent,
    ],
    imports: [
        CommonModule,
    ],
})
export class SudokuGridValueModule { }

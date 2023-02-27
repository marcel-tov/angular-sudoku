import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
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
        FlexLayoutModule,
    ],
})
export class SudokuGridValueModule { }

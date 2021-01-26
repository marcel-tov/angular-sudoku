import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SudokuGridItemComponent } from './sudoku-grid-item.component';

@NgModule({
  declarations: [
    SudokuGridItemComponent,
  ],
  exports: [
    SudokuGridItemComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
})
export class SudokuGridItemModule { }

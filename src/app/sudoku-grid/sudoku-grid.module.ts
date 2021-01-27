import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGridComponent } from './sudoku-grid.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SudokuGridValueModule } from '../sudoku-grid-value/sudoku-grid-value.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    SudokuGridComponent,
  ],
  exports: [
    SudokuGridComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSlideToggleModule,
    SudokuGridValueModule,
    FlexLayoutModule,
    MatIconModule,
    MatTooltipModule,
    MatGridListModule,
  ],
})
export class SudokuGridModule { }

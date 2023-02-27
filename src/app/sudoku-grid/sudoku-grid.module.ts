import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGridComponent } from './sudoku-grid.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
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

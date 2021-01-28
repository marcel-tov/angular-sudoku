import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SudokuDialogComponent } from './sudoku-dialog.component';

@NgModule({
  declarations: [
    SudokuDialogComponent,
  ],
  exports: [
    SudokuDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
})
export class SudokuDialogModule { }

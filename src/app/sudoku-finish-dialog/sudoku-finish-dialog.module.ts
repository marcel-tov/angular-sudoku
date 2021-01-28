import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SudokuFinishDialogComponent } from './sudoku-finish-dialog.component';

@NgModule({
  declarations: [
    SudokuFinishDialogComponent,
  ],
  exports: [
    SudokuFinishDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
})
export class SudokuFinishDialogModule { }

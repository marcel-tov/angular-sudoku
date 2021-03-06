import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SudokuCreationDialogComponent } from './sudoku-creation-dialog.component';

@NgModule({
  declarations: [
    SudokuCreationDialogComponent,
  ],
  exports: [
    SudokuCreationDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
})
export class SudokuCreationDialogModule { }

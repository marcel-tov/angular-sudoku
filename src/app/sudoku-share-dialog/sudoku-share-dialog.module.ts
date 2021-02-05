import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SudokuShareDialogComponent } from './sudoku-share-dialog.component';

@NgModule({
  declarations: [
    SudokuShareDialogComponent,
  ],
  exports: [
    SudokuShareDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule,
  ],
})
export class SudokuShareDialogModule { }

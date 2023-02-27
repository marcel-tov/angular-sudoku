import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatIconModule} from '@angular/material/icon';
import {SudokuFinishDialogComponent} from './sudoku-finish-dialog.component';

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
    ],
})
export class SudokuFinishDialogModule { }

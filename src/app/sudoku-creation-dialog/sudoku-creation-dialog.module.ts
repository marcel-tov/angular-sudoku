import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {SudokuCreationDialogComponent} from './sudoku-creation-dialog.component';

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
    ],
})
export class SudokuCreationDialogModule { }

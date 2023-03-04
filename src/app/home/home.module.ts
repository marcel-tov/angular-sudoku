import {ClipboardModule} from '@angular/cdk/clipboard';
import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {SudokuCreationDialogModule} from '../sudoku-creation-dialog/sudoku-creation-dialog.module';
import {SudokuFinishDialogModule} from '../sudoku-finish-dialog/sudoku-finish-dialog.module';
import {SudokuGridModule} from '../sudoku-grid/sudoku-grid.module';
import {SudokuShareDialogModule} from '../sudoku-share-dialog/sudoku-share-dialog.module';
import {HomeComponent} from './home.component';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        SudokuGridModule,
        ClipboardModule,
        SudokuFinishDialogModule,
        SudokuCreationDialogModule,
        SudokuShareDialogModule,
        MatDialogModule,
    ],
})
export class HomeModule { }

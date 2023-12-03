import {ClipboardModule} from '@angular/cdk/clipboard';
import {NgModule} from '@angular/core';
import {SudokuCreationDialogComponent} from '../sudoku-creation-dialog/sudoku-creation-dialog.component';
import {SudokuFinishDialogComponent} from '../sudoku-finish-dialog/sudoku-finish-dialog.component';
import {SudokuGridComponent} from '../sudoku-grid/sudoku-grid.component';
import {HomeComponent} from './home.component';
import {SudokuShareDialogComponent} from '../sudoku-share-dialog/sudoku-share-dialog.component';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        SudokuGridComponent,
        ClipboardModule,
        SudokuFinishDialogComponent,
        SudokuCreationDialogComponent,
        SudokuShareDialogComponent,
    ],
})
export class HomeModule { }

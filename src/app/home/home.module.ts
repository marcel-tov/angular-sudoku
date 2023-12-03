import {ClipboardModule} from '@angular/cdk/clipboard';
import {NgModule} from '@angular/core';
import {SudokuCreationDialogModule} from '../sudoku-creation-dialog/sudoku-creation-dialog.module';
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
        SudokuCreationDialogModule,
        SudokuShareDialogComponent,
    ],
})
export class HomeModule { }

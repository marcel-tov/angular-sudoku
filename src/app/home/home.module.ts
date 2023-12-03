import {ClipboardModule} from '@angular/cdk/clipboard';
import {NgModule} from '@angular/core';
import {SudokuCreationDialogModule} from '../sudoku-creation-dialog/sudoku-creation-dialog.module';
import {SudokuFinishDialogModule} from '../sudoku-finish-dialog/sudoku-finish-dialog.module';
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
        SudokuFinishDialogModule,
        SudokuCreationDialogModule,
        SudokuShareDialogComponent,
    ],
})
export class HomeModule { }

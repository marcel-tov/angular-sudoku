import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NotificationModule} from '../notification/notification.module';
import {SudokuShareDialogComponent} from './sudoku-share-dialog.component';

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
        MatTooltipModule,
        NotificationModule,
    ],
})
export class SudokuShareDialogModule { }

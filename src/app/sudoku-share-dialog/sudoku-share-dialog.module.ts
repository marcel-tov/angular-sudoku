import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
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
        FlexLayoutModule,
        MatTooltipModule,
        NotificationModule,
    ],
})
export class SudokuShareDialogModule { }

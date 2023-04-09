
import {ISudokuShareDialogData, SudokuShareDialogComponent} from './sudoku-share-dialog.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatLegacyDialogModule as MatDialogModule,
    MatLegacyDialogRef as MatDialogRef,
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import {RouterModule} from '@angular/router';
import {NotificationService} from '../notification/notification.service';
import {getEmptyRow} from '../sudoku-grid/sudoku-grid.component';
import {Clipboard} from "@angular/cdk/clipboard";

describe('SudokuShareDialogComponent', () => {
    const data: ISudokuShareDialogData = {
        grid: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
            getEmptyRow(),
        ],
    };
    let spectator: Spectator<SudokuShareDialogComponent>;
    const createComponent: SpectatorFactory<SudokuShareDialogComponent> = createComponentFactory({
        component: SudokuShareDialogComponent,
        imports: [
            MatDialogModule,
            RouterModule,
        ],
        mocks: [
            MatDialogRef,
            Clipboard,
            NotificationService,
        ],
        providers: [
            {provide: MAT_DIALOG_DATA, useValue: data},
        ],
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('Does show dialog data', () => {
        spectator.setInput({data});
        spectator.detectChanges();
        expect(spectator.query('h1')).toContainText('Share Sudoku');
    });

    it('Does return nothing on close', () => {
        const selector: DOMSelector = byTextContent('close', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith();
    });

    it('Does copy grid string to clipboard', () => {
        spectator.setInput({data});
        const selector: DOMSelector = byTextContent('content_copy', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(NotificationService).showSuccess).toHaveBeenCalledWith('Link copied to clipboard');
        // expect(spectator.inject(Clipboard).copy).toHaveBeenCalledWith();
    });
});

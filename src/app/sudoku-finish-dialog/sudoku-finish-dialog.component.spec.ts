
import {ISudokuFinishDialogData, SudokuFinishDialogComponent} from './sudoku-finish-dialog.component';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent, DOMSelector} from '@ngneat/spectator/jest';
import {
    MatLegacyDialogModule as MatDialogModule,
    MatLegacyDialogRef as MatDialogRef,
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';

describe('SudokuFinishDialogComponent', () => {
    const data: ISudokuFinishDialogData = {
        title: 'test-title',
        description: 'test-description',
        icon: 'test-icon',
    };
    let spectator: Spectator<SudokuFinishDialogComponent>;
    const createComponent: SpectatorFactory<SudokuFinishDialogComponent> = createComponentFactory({
        component: SudokuFinishDialogComponent,
        imports: [
            MatDialogModule,
        ],
        mocks: [
            MatDialogRef,
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
        expect(spectator.query('h1')).toContainText('test-title');
        expect(spectator.query('mat-icon')).toContainText('test-icon');
        expect(spectator.query('p')).toContainText('test-description');
    });

    it('Does return nothing on OK', () => {
        const selector: DOMSelector = byTextContent('OK', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith();
    });
});

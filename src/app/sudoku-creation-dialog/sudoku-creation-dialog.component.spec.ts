
import {SudokuCreationDialogComponent} from './sudoku-creation-dialog.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatLegacyDialogModule as MatDialogModule,
    MatLegacyDialogRef as MatDialogRef,
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';

describe('SudokuCreationDialogComponent', () => {
    let spectator: Spectator<SudokuCreationDialogComponent>;
    const createComponent: SpectatorFactory<SudokuCreationDialogComponent> = createComponentFactory({
        component: SudokuCreationDialogComponent,
        imports: [
            MatDialogModule,
        ],
        mocks: [
            MatDialogRef,
        ],
        providers: [
            {provide: MAT_DIALOG_DATA, useValue: {}},
        ],
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('Does return nothing on cancel', () => {
        const selector: DOMSelector = byTextContent('Cancel', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith();
    });

    it('Does return difficulty on submit', () => {
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('Medium', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith('Medium');
    });
});

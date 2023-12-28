
import {CreationDialogComponent} from './creation-dialog.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatDialogModule,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

describe('CreationDialogComponent', () => {
    let spectator: Spectator<CreationDialogComponent>;
    const createComponent: SpectatorFactory<CreationDialogComponent> = createComponentFactory({
        component: CreationDialogComponent,
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
        const selector: DOMSelector = byTextContent('cancel', {selector: 'button'});
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

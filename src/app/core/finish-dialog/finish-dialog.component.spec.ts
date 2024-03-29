
import {IFinishDialogData, FinishDialogComponent} from './finish-dialog.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatDialogModule,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

describe('FinishDialogComponent', () => {
    const data: IFinishDialogData = {
        title: 'test-title',
        description: 'test-description',
        icon: 'test-icon',
    };
    let spectator: Spectator<FinishDialogComponent>;
    const createComponent: SpectatorFactory<FinishDialogComponent> = createComponentFactory({
        component: FinishDialogComponent,
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


import {IShareDialogData, ShareDialogComponent} from './share-dialog.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';
import {
    MatDialogModule,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {RouterModule} from '@angular/router';
import {NotificationService} from '../notification/notification.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {NotificationModule} from '../notification/notification.module';
import {getEmptyRow} from '../grid-helper/empty-row';

describe('ShareDialogComponent', () => {
    const data: IShareDialogData = {
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
    let spectator: Spectator<ShareDialogComponent>;
    const createComponent: SpectatorFactory<ShareDialogComponent> = createComponentFactory({
        component: ShareDialogComponent,
        imports: [
            MatDialogModule,
            RouterModule,
        ],
        mocks: [
            MatDialogRef,
            Clipboard,
            NotificationService,
        ],
        overrideComponents: [
            [
                ShareDialogComponent,
                {
                    remove: {
                        imports: [NotificationModule],
                    },
                },
            ],
        ],
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => {
        spectator = createComponent({
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: data},
            ],
        });
    });

    it('Does show dialog data', () => {
        spectator.detectChanges();
        expect(spectator.query('h1')).toContainText('Share Sudoku');
    });

    it('Does return nothing on close', () => {
        const selector: DOMSelector = byTextContent('close', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith();
    });

    it('Does copy grid string to clipboard', () => {
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('content_copy', {selector: 'button'});
        spectator.click(selector);
        expect(spectator.inject(Clipboard).copy)
            .toHaveBeenCalledWith(`${window.location.origin}/123456789........................................................................`);
        expect(spectator.inject(NotificationService).showSuccess).toHaveBeenCalledWith('Link copied to clipboard');
    });
});

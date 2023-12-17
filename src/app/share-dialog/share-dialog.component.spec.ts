
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
import {getEmptyRow} from '../grid/grid.component';
import {Clipboard} from '@angular/cdk/clipboard';
import {NotificationModule} from '../notification/notification.module';

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
        providers: [
            {provide: MAT_DIALOG_DATA, useValue: data},
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
        expect(spectator.inject(Clipboard).copy)
            .toHaveBeenCalledWith(`${window.location.origin}/123456789........................................................................`);
    });
});

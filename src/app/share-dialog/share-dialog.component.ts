import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';
import {SudokuGrid, SudokuRow, SudokuValue} from '../grid/grid.component';
import {Router} from '@angular/router';
import {NotificationService} from '../notification/notification.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NotificationModule} from '../notification/notification.module';

@Component({
    selector: 'share-dialog',
    templateUrl: './share-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NotificationModule,
    ],
})
class ShareDialogComponent {
    public readonly shareLink: string;

    constructor(
        public dialogRef: MatDialogRef<ShareDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ISudokuShareDialogData,
        private clipboard: Clipboard,
        private router: Router,
        private notificationService: NotificationService,
    ) {
        const gridParam: string = this.router.createUrlTree(['/', gridToConfig(this.data.grid)]).toString();
        const domain: string = window.location.origin;
        this.shareLink = `${domain}${gridParam}`;
    }

    public close(): void {
        this.dialogRef.close();
    }

    public copyLink(): void {
        this.clipboard.copy(this.shareLink);
        this.notificationService.showSuccess('Link copied to clipboard');
    }
}

interface ISudokuShareDialogData {
    grid: SudokuGrid;
}

function gridToConfig(grid: SudokuGrid): string {
    return grid.reduce((value: string, row: SudokuRow) => {

        value += row
            .map((item: SudokuValue) => item === null ? '.' : item)
            .join('');

        return value;
    }, '');
}

export {ShareDialogComponent, ISudokuShareDialogData};
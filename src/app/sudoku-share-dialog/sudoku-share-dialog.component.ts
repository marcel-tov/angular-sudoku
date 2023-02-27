import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import {Clipboard} from '@angular/cdk/clipboard';
import {SudokuGrid, SudokuRow, SudokuValue} from '../sudoku-grid/sudoku-grid.component';
import {Router} from '@angular/router';
import {NotificationService} from '../notification/notification.service';

@Component({
    selector: 'app-sudoku-share-dialog',
    templateUrl: './sudoku-share-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class SudokuShareDialogComponent {
    public readonly shareLink: string;

    constructor(
        public dialogRef: MatDialogRef<SudokuShareDialogComponent>,
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

export {SudokuShareDialogComponent, ISudokuShareDialogData};

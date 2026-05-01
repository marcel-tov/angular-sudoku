import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    HostListener,
    InputSignal,
    OutputEmitterRef,
    Signal,
    WritableSignal,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {GridValueComponent} from '../grid-value/grid-value.component';
import {SudokuGrid, SudokuRow, SudokuValue} from '../grid-helper/types';
import {getEmptyGrid, getEmptyRow} from '../grid-helper/empty-row';
import {isValueValid} from '../grid-helper/is-value-valid';
import {solveSudoku} from '../grid-helper/solve-sudoku';
import {GridTopNavigationComponent} from '../grid-top-navigation/grid-top-navigation.component';
import {GridFooterNavigationComponent} from '../grid-footer-navigation/grid-footer-navigation.component';

@Component({
    selector: 'grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        GridValueComponent,
        GridTopNavigationComponent,
        GridFooterNavigationComponent,
    ],
})
class GridComponent {
    // Inputs
    public readonly originalGrid: InputSignal<SudokuGrid> = input.required<SudokuGrid>();
    public readonly showTopNavigation: InputSignal<boolean> = input(true);
    public readonly showFooterNavigation: InputSignal<boolean> = input(true);

    // Outputs
    public readonly share: OutputEmitterRef<SudokuGrid> = output<SudokuGrid>();
    public readonly create: OutputEmitterRef<void> = output<void>();
    public readonly scan: OutputEmitterRef<void> = output<void>();
    public readonly finish: OutputEmitterRef<IOnFinishGridEvent> = output<IOnFinishGridEvent>();

    // Public state (accessed from template)
    public readonly lockValues: WritableSignal<boolean> = signal(true);
    public readonly showNominees: WritableSignal<boolean> = signal(false);

    // Protected state
    protected readonly grid: WritableSignal<SudokuGrid> = signal<SudokuGrid>(getEmptyGrid());
    protected readonly solvedGrid: Signal<SudokuGrid | null> = computed(() => {
        if (!this.isHelpEnabled()) {
            return null;
        }

        const clonedGrid: SudokuGrid = structuredClone(this.baseGrid());
        solveSudoku(clonedGrid);

        return clonedGrid;
    });
    protected readonly selectedRowIndex: WritableSignal<number | null> = signal<number | null>(null);
    protected readonly selectedColIndex: WritableSignal<number | null> = signal<number | null>(null);
    protected readonly isHelpEnabled: WritableSignal<boolean> = signal(false);
    protected readonly gridNomineeValues: WritableSignal<Array<Array<Array<SudokuValue>>>> = signal<Array<Array<Array<SudokuValue>>>>([]);
    protected readonly formattedTime: Signal<string> = computed(() => timerFormatter(this.time()));

    // Internal state
    // baseGrid tracks which cells are read-only (originalGrid snapshot that can be
    // re-committed when the user re-locks after editing in unlocked mode)
    private readonly baseGrid: WritableSignal<SudokuGrid> = signal<SudokuGrid>(getEmptyGrid());
    private readonly time: WritableSignal<number> = signal(0);
    private timerSubscription: Subscription | null = null;
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor() {
        // Replaces ngOnChanges: re-runs whenever originalGrid input changes
        effect(() => {
            const grid: SudokuGrid = this.originalGrid();
            this.baseGrid.set(structuredClone(grid));
            this.grid.set(structuredClone(grid));
            this.initalizeGrid();
        });

        this.destroyRef.onDestroy(() => this.cancelTimer());
    }

    public isValueReadOnly(row: number, col: number): boolean {
        if (!this.lockValues()) {
            return false;
        }

        return this.baseGrid()[row][col] !== null;
    }

    public isGroupTop(row: number): boolean {
        return row % 3 === 0;
    }

    public isGroupEnd(col: number): boolean {
        return col % 3 === 0;
    }

    public isGridBottom(row: number): boolean {
        return row === 8;
    }

    public isGridEnd(col: number): boolean {
        return col === 8;
    }

    /**
     * Checks if a given number can be placed in a row/column.
     */
    public isValueValid(row: number, col: number, value: SudokuValue): boolean {
        return isValueValid(this.grid(), row, col, value);
    }

    public isValueSelected(row: number, col: number): boolean {
        return !!(this.selectedRowIndex() === row && this.selectedColIndex() === col);
    }

    /**
     * A cell is a "peer" of the selected cell when it shares the same row,
     * column, or 3×3 block with it (but is not the selected cell itself).
     */
    public isValuePeer(row: number, col: number): boolean {
        const selRow: number | null = this.selectedRowIndex();
        const selCol: number | null = this.selectedColIndex();
        if (selRow === null || selCol === null) {
            return false;
        }

        if (selRow === row && selCol === col) {
            return false;
        }

        if (selRow === row || selCol === col) {
            return true;
        }

        const boxRow: number = selRow - selRow % 3;
        const boxCol: number = selCol - selCol % 3;

        return row >= boxRow && row < boxRow + 3
            && col >= boxCol && col < boxCol + 3;
    }

    public toogleSelectedValue(row: number, col: number): void {
        if (this.isValueReadOnly(row, col)) {
            return;
        }

        if (this.isValueSelected(row, col)) {
            this.toggleNominees();
        }

        this.selectedRowIndex.set(row);
        this.selectedColIndex.set(col);
    }

    public toggleNominees(): void {
        this.showNominees.update((v: boolean) => !v);
    }

    public hasSelectedValue(): boolean {
        return this.selectedRowIndex() !== null && this.selectedColIndex() !== null;
    }

    public deleteSelectedValue(): void {
        const selRow: number | null = this.selectedRowIndex();
        const selCol: number | null = this.selectedColIndex();
        if (selRow === null || selCol === null) {
            return;
        }

        if (this.showNominees()) {
            this.toggleNomineeValue(selRow, selCol, null);
        } else {
            this.onValueChange(selRow, selCol, null);
        }
    }

    public isValueErroneous(row: number, col: number, value: SudokuValue): boolean {
        const solved: SudokuGrid | null = this.solvedGrid();
        if (solved === null) {
            return false;
        }

        return solved[row][col] !== value;
    }

    public onSelectValue(value: SudokuValue): void {
        const selRow: number | null = this.selectedRowIndex();
        const selCol: number | null = this.selectedColIndex();
        if (selRow === null || selCol === null) {
            return;
        }

        if (this.showNominees()) {
            this.toggleNomineeValue(selRow, selCol, value);
        } else {
            this.onValueChange(selRow, selCol, value);

            if (value !== null && value > 0) {
                this.updateAffectedNomineeValue(value);
            }

            // If the last value was added
            if (this.isGridFinish()) {
                this.onFinishGrid();
            }
        }
    }

    public onChangeLockValues(): void {
        this.lockValues.update((v: boolean) => !v);

        if (this.lockValues()) {
            // Commit the current grid as the new base (locked state)
            this.baseGrid.set(structuredClone(this.grid()));
            this.initalizeGrid();
        }
    }

    public onShareGrid(): void {
        this.share.emit(this.originalGrid());
    }

    public onCreateGrid(): void {
        this.create.emit();
    }

    public onScanGrid(): void {
        this.scan.emit();
    }

    public clearAllValues(): void {
        this.grid.set(getEmptyGrid());
    }

    /**
     * @deprecated https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
     */
    @HostListener('window:keydown', ['$event'])
    protected onKeydown(event: KeyboardEvent): void {
        const value: number = Number(event.key);
        if (value > 0 && value <= 9) {
            this.onSelectValue(value as SudokuValue);
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
            this.onSelectValue(null);
        }
    }

    private initalizeGrid(): void {
        this.gridNomineeValues.set(
            Array.from({length: 9}, () =>
                Array.from({length: 9}, () => getEmptyRow()),
            ),
        );

        this.selectedRowIndex.set(null);
        this.selectedColIndex.set(null);
        this.showNominees.set(false);
        this.isHelpEnabled.set(false);
        this.time.set(0);

        this.cancelTimer();
        this.timerSubscription = timer(0, 1000).subscribe(() => {
            this.time.update((t: number) => t + 1);
        });
    }

    private onValueChange(row: number, col: number, value: SudokuValue): void {
        const v: number = Number(value);
        this.grid.update((grid: SudokuGrid) => {
            const updated: SudokuGrid = grid.map((r: SudokuRow) => [...r]) as unknown as SudokuGrid;
            updated[row][col] = (v > 0 && v <= 9) ? (v as SudokuValue) : null;

            return updated;
        });
    }

    private toggleNomineeValue(row: number, col: number, value: SudokuValue): void {
        this.gridNomineeValues.update((nominees: Array<Array<Array<SudokuValue>>>) => {
            const updated: Array<Array<Array<SudokuValue>>> = nominees.map((r: Array<Array<SudokuValue>>) => r.map((c: Array<SudokuValue>) => [...c]));

            if (value === null) {
                updated[row][col] = getEmptyRow();
            } else {
                const v: number = Number(value);
                updated[row][col][v - 1] = updated[row][col][v - 1] === null ? (v as SudokuValue) : null;
            }

            return updated;
        });
    }

    private updateAffectedNomineeValue(value: SudokuValue): void {
        const selRow: number | null = this.selectedRowIndex();
        const selCol: number | null = this.selectedColIndex();
        if (selRow === null || selCol === null) {
            return;
        }

        const v: number = Number(value);

        this.gridNomineeValues.update((nominees: Array<Array<Array<SudokuValue>>>) => {
            const updated: Array<Array<Array<SudokuValue>>> = nominees.map((r: Array<Array<SudokuValue>>) => r.map((c: Array<SudokuValue>) => [...c]));

            // Empty nominees of the just-filled cell
            updated[selRow][selCol] = getEmptyRow();

            // Remove same nominee value from the same row
            for (let col: number = 0; col < 9; col++) {
                updated[selRow][col][v - 1] = null;
            }

            // Remove same nominee value from the same column
            for (let row: number = 0; row < 9; row++) {
                updated[row][selCol][v - 1] = null;
            }

            // Remove same nominee value from the same 3×3 square
            const boxRow: number = selRow - selRow % 3;
            const boxCol: number = selCol - selCol % 3;
            for (let x: number = 0; x < 3; x++) {
                for (let y: number = 0; y < 3; y++) {
                    updated[x + boxRow][y + boxCol][v - 1] = null;
                }
            }

            return updated;
        });
    }

    private onFinishGrid(): void {
        this.cancelTimer();

        const grid: SudokuGrid = this.grid();
        let isGridValid: boolean = true;
        for (let row: number = 0; row < 9; row++) {
            for (let col: number = 0; col < 9; col++) {
                if (this.isValueErroneous(row, col, grid[row][col])) {
                    isGridValid = false;
                }
            }
        }

        this.finish.emit({
            grid,
            isGridValid,
            time: this.time(),
        });
    }

    private cancelTimer(): void {
        this.timerSubscription?.unsubscribe();
        this.timerSubscription = null;
    }

    private isGridFinish(): boolean {
        return this.grid().every((row: SudokuRow) => row.every((cell: SudokuValue) => cell !== null));
    }
}

function timerFormatter(time: number): string {
    const hours: string = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes: string = Math.floor(time % 3600 / 60).toString().padStart(2, '0');
    const seconds: string = Math.floor(time % 3600 % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

interface IOnFinishGridEvent {
    grid: SudokuGrid;
    isGridValid: boolean;
    time: number;
}

export {GridComponent, IOnFinishGridEvent, timerFormatter};

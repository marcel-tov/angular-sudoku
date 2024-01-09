import {Injectable} from '@angular/core';
import {SudokuGrid, SudokuValue} from '../grid-helper/types';
import {getEmptyRow} from '../grid-helper/empty-row';
import {cloneDeep} from 'lodash';
import {solveSudoku} from '../grid-helper/solve-sudoku';
import {Subject} from 'rxjs';

@Injectable()
class GridService {
    public selectedRowIndex: number | null = null;
    public selectedColIndex: number | null = null;
    public showNominees: boolean = false;
    public originalGrid: SudokuGrid = [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
    public grid: SudokuGrid = [
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
        getEmptyRow(),
    ];
    public gridNomineeValues: Array<Array<Array<SudokuValue>>> = [];
    public onFinishGrid: Subject<IOnFinishGridEvent> = new Subject<IOnFinishGridEvent>();
    public isHelpEnabled: boolean = false;
    public solvedGrid: SudokuGrid | null = null;

    public hasSelectedValue(): boolean {
        return this.selectedRowIndex !== null && this.selectedColIndex !== null;
    }

    public deleteSelectedValue(): void {
        if (!this.hasSelectedValue()) {
            return;
        }

        if (this.showNominees) {
            this.toggleNomineeValue(this.selectedRowIndex, this.selectedColIndex, null);
        } else {
            this.onValueChange(this.selectedRowIndex, this.selectedColIndex, null);
        }
    }

    public toggleNomineeValue(row: number, col: number, value: SudokuValue): void {
        let modifiedNomineeValue: Array<SudokuValue> = cloneDeep(this.gridNomineeValues[row][col]);

        if (value === null) {
            modifiedNomineeValue = getEmptyRow();
        } else {
            value = Number(value);
            const indexValue: number = value - 1;

            modifiedNomineeValue[indexValue] = modifiedNomineeValue[indexValue] === null
                ? value
                : null;
        }

        this.gridNomineeValues[row][col] = modifiedNomineeValue;
    }

    public onSelectValue(value: SudokuValue): void {
        if (!this.hasSelectedValue()) {
            return;
        }

        if (this.showNominees) {
            this.toggleNomineeValue(this.selectedRowIndex, this.selectedColIndex, value);
        } else {
            this.onValueChange(this.selectedRowIndex, this.selectedColIndex, value);

            if (value > 0) {
                this.updateAffectedNomineeValue(value);
            }

            // If the last value was added
            if (this.isGridFinish()) {
                this.onFinishGrid.next({
                    grid: this.grid,
                    isGridValid: this.isGridValid(),
                });
            }
        }
    }

    public isValueErroneous(row: number, col: number, value: SudokuValue): boolean {
        if (this.isHelpEnabled && this.solvedGrid === null) {
            const clonedGrid: SudokuGrid = cloneDeep(this.originalGrid);
            solveSudoku(clonedGrid);
            this.solvedGrid = clonedGrid;
        }

        return this.solvedGrid[row][col] !== value;
    }

    private onValueChange(row: number, col: number, value: SudokuValue): void {
        value = Number(value);

        this.grid[row][col] = (value > 0 && value <= 9)
            ? value
            : null;

    // this.onChange.emit(this.grid);
    }

    private updateAffectedNomineeValue(value: SudokuValue): void {
        if (!this.hasSelectedValue()) {
            return;
        }

        // Empty nominees of selected value
        this.gridNomineeValues[this.selectedRowIndex][this.selectedColIndex] = getEmptyRow();

        // Remove same nominee values of same row
        for (const colValue of Object.keys(this.grid[this.selectedRowIndex])) {
            this.removeNomineeValue(this.selectedRowIndex, Number(colValue), value);
        }

        // Remove same nominee values of same col
        for (const rowValue of Object.keys(this.grid)) {
            this.removeNomineeValue(Number(rowValue), this.selectedColIndex, value);
        }

        // Remove same nominee values of same square
        const row: number = this.selectedRowIndex - this.selectedRowIndex % 3;
        const col: number = this.selectedColIndex - this.selectedColIndex % 3;

        for (let x: number = 0; x < 3; x++) {
            for (let y: number = 0; y < 3; y++) {
                this.removeNomineeValue(x + row, y + col, value);
            }
        }
    }

    private removeNomineeValue(row: number, col: number, value: SudokuValue): void {
        if (value === null) {
            return;
        }

        const modifiedNomineeValue: Array<SudokuValue> = cloneDeep(this.gridNomineeValues[row][col]);

        value = Number(value);
        if (modifiedNomineeValue.includes(value)) {
            const indexValue: number = value - 1;

            modifiedNomineeValue[indexValue] = null;

            this.gridNomineeValues[row][col] = modifiedNomineeValue;
        }
    }

    private isGridValid(): boolean {
        let isGridValid: boolean = true;
        for (const row of Object.keys(this.grid)) {
            for (const col of Object.keys(this.grid[row])) {
                if (this.isValueErroneous(Number(row), Number(col), this.grid[row][col])) {
                    isGridValid = false;
                }
            }
        }

        return isGridValid;
    }

    private isGridFinish(): boolean {
        for (const row of Object.keys(this.grid)) {
            for (const col of Object.keys(this.grid[row])) {
                const value: SudokuValue = this.grid[row][col];

                if (value === null) {
                    return false;
                }
            }
        }

        return true;
    }
}

interface IOnFinishGridEvent {
    grid: SudokuGrid;
    isGridValid: boolean;
}

export {GridService, IOnFinishGridEvent};


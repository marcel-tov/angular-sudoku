import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { SudokuValue } from '../sudoku-grid/sudoku-grid.component';

@Component({
  selector: 'app-sudoku-grid-item',
  templateUrl: './sudoku-grid-item.component.html',
  styleUrls: ['./sudoku-grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuGridItemComponent implements OnChanges {
  @Input() public value: SudokuValue = null;
  @Input() public nomineeValue: ReplaySubject<SudokuValue> = new ReplaySubject();
  @Input() public isSelected: boolean = false;
  @Input() public isReadOnly: boolean = false;
  @Input() public hasError: boolean = false;
  @Input() public showNominees: boolean = false;
  public nominees: Array<SudokuValue> = [];
  public subscription: Subscription | null = null

  constructor(private changeDetector: ChangeDetectorRef) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.nomineeValue && changes.nomineeValue.currentValue !== undefined) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.initializeNominees();

      this.subscription = this.nomineeValue.subscribe((nomineeValue: SudokuValue) => {
        if (this.isSelected && this.showNominees) {
          if (nomineeValue === null) {
            this.initializeNominees();
          } else {
            this.toggleNomineeValue(nomineeValue);
          }

          this.changeDetector.detectChanges();
        }
      });
    }
  }

  private toggleNomineeValue(value: SudokuValue): void {
    value = Number(value);
    const indexValue: number = value - 1;

    this.nominees[indexValue] = this.nominees[indexValue] === null
      ? value
      : null;
  }

  private initializeNominees(): void {
    const nominees: Array<SudokuValue> = [];
    for (let i: number = 0; i < 9; i++) {
      nominees.push(null);
    }
    this.nominees = nominees;
  }
}

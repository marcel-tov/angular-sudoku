import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { SudokuItem } from '../sudoku-grid/sudoku-grid.component';

@Component({
  selector: 'app-sudoku-grid-item',
  templateUrl: './sudoku-grid-item.component.html',
  styleUrls: ['./sudoku-grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SudokuGridItemComponent implements OnChanges {
  @Input() public value: SudokuItem = null;
  @Input() public nomineeValue: ReplaySubject<SudokuItem> = new ReplaySubject();
  @Input() public isSelected: boolean = false;
  @Input() public isReadOnly: boolean = false;
  @Input() public hasError: boolean = false;
  @Input() public showNominees: boolean = false;
  public nominees: Array<SudokuItem> = [];
  public subscription: Subscription | null = null

  constructor(private changeDetector: ChangeDetectorRef) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.nomineeValue && changes.nomineeValue.currentValue !== undefined) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.initializeNominees();

      this.subscription = this.nomineeValue.subscribe((nomineeValue: SudokuItem) => {
        if (this.isSelected && this.showNominees) {
          this.toggleNomineeValue(nomineeValue);

          this.changeDetector.detectChanges();
        }
      });
    }
  }

  private toggleNomineeValue(value: SudokuItem): void {
    value = Number(value);
    const indexValue: number = value - 1;

    this.nominees[indexValue] = this.nominees[indexValue] === null
      ? value
      : null;
  }

  private initializeNominees(): void {
    const nominees: Array<SudokuItem> = [];
    for (let i: number = 0; i < 9; i++) {
      nominees.push(null);
    }
    this.nominees = nominees;
  }
}

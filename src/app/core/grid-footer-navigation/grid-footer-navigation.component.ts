import {
    ChangeDetectionStrategy,
    Component,
    InputSignal,
    OutputEmitterRef,
    input,
    output,
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NomineeValuesComponent} from '../nominee-values/nominee-values.component';
import {SudokuValue} from '../grid-helper/types';

@Component({
    selector: 'grid-footer-navigation',
    templateUrl: './grid-footer-navigation.component.html',
    styleUrls: ['./grid-footer-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatSlideToggleModule,
        NomineeValuesComponent,
    ],
})
class GridFooterNavigationComponent {
    public readonly hasSelectedValue: InputSignal<boolean> = input.required<boolean>();
    public readonly showNominees: InputSignal<boolean> = input.required<boolean>();
    public readonly isHelpEnabled: InputSignal<boolean> = input.required<boolean>();

    public readonly deleteValue: OutputEmitterRef<void> = output<void>();
    public readonly nomineeToggle: OutputEmitterRef<void> = output<void>();
    public readonly helpChange: OutputEmitterRef<boolean> = output<boolean>();
    public readonly selectValue: OutputEmitterRef<SudokuValue> = output<SudokuValue>();
}

export {GridFooterNavigationComponent};

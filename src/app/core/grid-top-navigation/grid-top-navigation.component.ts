import {
    ChangeDetectionStrategy,
    Component,
    InputSignal,
    OutputEmitterRef,
    input,
    output,
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {isFirebaseConfigured} from '../scan-dialog/firebase-status';

@Component({
    selector: 'grid-top-navigation',
    templateUrl: './grid-top-navigation.component.html',
    styleUrls: ['./grid-top-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
})
class GridTopNavigationComponent {
    public readonly lockValues: InputSignal<boolean> = input.required<boolean>();
    public readonly time: InputSignal<string> = input.required<string>();

    public readonly share: OutputEmitterRef<void> = output<void>();
    public readonly create: OutputEmitterRef<void> = output<void>();
    public readonly clearAll: OutputEmitterRef<void> = output<void>();
    public readonly lockValuesChange: OutputEmitterRef<void> = output<void>();
    public readonly scan: OutputEmitterRef<void> = output<void>();

    protected readonly isScanAvailable: boolean = isFirebaseConfigured;
}

export {GridTopNavigationComponent};

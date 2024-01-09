import {ChangeDetectionStrategy, Component, Output, EventEmitter} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
    selector: 'share-button',
    templateUrl: './share-button.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
})
class ShareButtonComponent {
    @Output() public onClick: EventEmitter<void> = new EventEmitter<void>();

    public click(): void {
        this.onClick.emit();
    }
}

export {ShareButtonComponent};

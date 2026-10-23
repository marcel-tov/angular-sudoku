import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {environment} from '../environments/environment';
import {ThemeService} from './core/theme/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, MatButtonModule, MatIconModule, MatTooltipModule],
})
export class AppComponent {
    protected readonly version: string = environment.version;
    protected readonly theme: ThemeService = inject(ThemeService);
}

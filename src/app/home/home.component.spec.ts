
import {HomeComponent} from './home.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator';
import {RouterModule} from '@angular/router';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';

fdescribe('HomeComponent', () => {
    let spectator: Spectator<HomeComponent>;
    const createComponent: SpectatorFactory<HomeComponent> = createComponentFactory({
        component: HomeComponent,
        imports: [
            RouterModule.forRoot([]),
            MatDialogModule,
        ],
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('should create component', () => {
        expect(spectator.query('div')).toHaveClass('home');
    });

    it('sshould contain router-outlet', () => {
        expect(spectator.query('div.home')).toHaveDescendant('app-sudoku-grid.home__grid');
    });
});

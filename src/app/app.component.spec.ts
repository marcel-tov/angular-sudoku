
import {AppComponent} from './app.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator';

describe('AppComponent', () => {
    let spectator: Spectator<AppComponent>;
    const createComponent: SpectatorFactory<AppComponent> = createComponentFactory({
        component: AppComponent,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('should create the app', () => {
        expect(spectator.query('div')).toHaveClass('app');
    });

    it('should contain router-outlet', () => {
        expect(spectator.query('div.app')).toHaveDescendant('router-outlet');
    });
});

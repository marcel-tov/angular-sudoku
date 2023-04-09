
import {PageNotFoundComponent} from './page-not-found.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator/jest';

describe('PageNotFoundComponent', () => {
    let spectator: Spectator<PageNotFoundComponent>;
    const createComponent: SpectatorFactory<PageNotFoundComponent> = createComponentFactory({
        component: PageNotFoundComponent,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('should create component', () => {
        expect(spectator.query('div')).toHaveClass('page-not-found');
    });

    it('does show grid', () => {
        expect(spectator.query('div.page-not-found')).toHaveDescendant('app-sudoku-grid.page-not-found__grid');
    });

    it('does show page found link', async () => {
        expect(spectator.query('div.page-not-found > .page-not-found-link')).toHaveDescendant('.page-not-found-link__home-link');
        expect(spectator.query('.page-not-found-link__home-link')).toHaveAttribute('href', '/');
    });
});


import {GridValueComponent} from './grid-value.component';
import {Spectator, createComponentFactory, SpectatorFactory} from '@ngneat/spectator/jest';

describe('GridValueComponent', () => {
    let spectator: Spectator<GridValueComponent>;
    const createComponent: SpectatorFactory<GridValueComponent> = createComponentFactory({
        component: GridValueComponent,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    it('Does show value as readonly', () => {
        spectator.setInput('isReadOnly', true);
        spectator.detectChanges();
        expect(spectator.query('.grid-value')).toHaveClass(('grid-value--readonly'));
    });

    it('Does show value as clickable', () => {
        spectator.setInput('isReadOnly', false);
        spectator.detectChanges();
        expect(spectator.query('.grid-value')).not.toHaveClass(('grid-value--readonly'));
        expect(spectator.query('.grid-value')).toHaveClass(('grid-value--clickable'));
    });

    it('Does show value as selected', () => {
        spectator.setInput('isSelected', true);
        spectator.detectChanges();
        expect(spectator.query('.grid-value')).toHaveClass(('grid-value--selected'));
    });

    it('Does show value as error', () => {
        spectator.setInput('hasError', true);
        spectator.setInput('value', 111);
        spectator.detectChanges();
        expect(spectator.query('.grid-value')).toHaveClass(('grid-value--error'));
    });

    it('Does show value with status success', () => {
        spectator.setInput('hasSuccess', true);
        spectator.setInput('value', 111);
        spectator.detectChanges();
        expect(spectator.query('.grid-value')).toHaveClass(('grid-value--success'));
    });

    it('Does show nominees', () => {
        spectator.setInput('showNominees', true);
        spectator.setInput('isSelected', true);
        spectator.setInput('nomineeValues', [1, 2, 3]);
        spectator.detectChanges();
        expect(spectator.query('.grid-value')).toHaveClass(('grid-value--nominees'));
        expect(spectator.query('.nominees-grid__value:nth-of-type(1)')).toHaveExactText('1');
        expect(spectator.query('.nominees-grid__value:nth-of-type(2)')).toHaveExactText('2');
        expect(spectator.query('.nominees-grid__value:nth-of-type(3)')).toHaveExactText('3');
    });

    it('Does not show grid value when null', () => {
        spectator.setInput('value', null);
        spectator.detectChanges();
        expect(spectator.query('.grid-value__value')).toBeNull();
    });

    it('Does show grid value', () => {
        spectator.setInput('value', 111);
        spectator.detectChanges();
        expect(spectator.query('.grid-value__value')).toHaveExactText('111');
    });
});

import {GridFooterNavigationComponent} from './grid-footer-navigation.component';
import {DOMSelector} from '@ngneat/spectator';
import {Spectator, createComponentFactory, SpectatorFactory, byTextContent} from '@ngneat/spectator/jest';

describe('GridFooterNavigationComponent', () => {
    let spectator: Spectator<GridFooterNavigationComponent>;
    const createComponent: SpectatorFactory<GridFooterNavigationComponent> = createComponentFactory({
        component: GridFooterNavigationComponent,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it('Does show container', () => {
        spectator.setInput({hasSelectedValue: false, showNominees: false, isHelpEnabled: false});
        spectator.detectChanges();
        expect(spectator.queryAll('div.grid-footer-navigation')[0]).toHaveClass('grid-footer-navigation');
    });

    it('Does disable delete button when no value is selected', () => {
        spectator.setInput({hasSelectedValue: false, showNominees: false, isHelpEnabled: false});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Delete a selected value"]')).toBeDisabled();
    });

    it('Does enable delete button when value is selected', () => {
        spectator.setInput({hasSelectedValue: true, showNominees: false, isHelpEnabled: false});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Delete a selected value"]')).not.toBeDisabled();
    });

    it('Does emit deleteValue on delete button click', () => {
        spectator.setInput({hasSelectedValue: true, showNominees: false, isHelpEnabled: false});
        const deleteSpy: jest.SpyInstance = jest.spyOn(spectator.component.deleteValue, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('Delete number', {selector: 'button'});
        spectator.click(selector);
        expect(deleteSpy).toHaveBeenCalledWith();
    });

    it('Does emit nomineeToggle on nominees button click', () => {
        spectator.setInput({hasSelectedValue: false, showNominees: false, isHelpEnabled: false});
        const nomineeSpy: jest.SpyInstance = jest.spyOn(spectator.component.nomineeToggle, 'emit');
        spectator.detectChanges();
        const selector: DOMSelector = byTextContent('Nominees', {selector: 'button'});
        spectator.click(selector);
        expect(nomineeSpy).toHaveBeenCalledWith();
    });

    it('Does show delete button text', () => {
        spectator.setInput({hasSelectedValue: false, showNominees: false, isHelpEnabled: false});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Delete a selected value"]')).toHaveText('Delete number');
    });

    it('Does show nominees button text', () => {
        spectator.setInput({hasSelectedValue: false, showNominees: false, isHelpEnabled: false});
        spectator.detectChanges();
        expect(spectator.query('button[aria-label="Toggle field edit nominees"]')).toHaveText('Nominees');
    });

    it('Does show help slide toggle', () => {
        spectator.setInput({hasSelectedValue: false, showNominees: false, isHelpEnabled: false});
        spectator.detectChanges();
        expect(spectator.query('mat-slide-toggle')).toHaveText('Help');
    });

    it('Does contain nominee values', () => {
        spectator.setInput({hasSelectedValue: false, showNominees: false, isHelpEnabled: false});
        spectator.detectChanges();
        expect(spectator.element).toHaveDescendant('nominee-values');
    });
});

import {NomineeValuesComponent} from './nominee-values.component';
import {byTextContent, createComponentFactory, Spectator, SpectatorFactory} from '@ngneat/spectator/vitest';
import {type MockInstance} from 'vitest';

describe('NomineeValuesComponent', () => {
    let spectator: Spectator<NomineeValuesComponent>;
    const createComponent: SpectatorFactory<NomineeValuesComponent> = createComponentFactory({
        component: NomineeValuesComponent,
        declareComponent: false,
        detectChanges: false,
        shallow: true,
    });

    beforeEach(() => spectator = createComponent());

    test.each([
        {value: 1},
        {value: 2},
        {value: 3},
        {value: 4},
        {value: 5},
        {value: 6},
        {value: 7},
        {value: 8},
        {value: 9},
    ])('Does correctly return nominee value for $value', ({value}: {value: number}) => {
        const onSelectValueSpy: MockInstance = vi.spyOn(spectator.component.onSelectValue, 'emit');
        spectator.detectChanges();
        spectator.click(byTextContent(value, {selector: 'button.nominee-value'}));
        expect(onSelectValueSpy).toHaveBeenCalledWith(value);
    });
});

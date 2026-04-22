// Classic puzzle: 0 = empty cell.
// Cell [0][2] is empty; the correct solution value there is 4.
const PUZZLE_GRID: string =
    '530070000' +
    '600195000' +
    '098000060' +
    '800060003' +
    '400803001' +
    '700020006' +
    '060000280' +
    '000419005' +
    '000080079';

// Same puzzle fully solved except cell [8][8] (index 80), which is 9.
const NEARLY_COMPLETE_GRID: string =
    '534678912' +
    '672195348' +
    '198342567' +
    '859761423' +
    '426853791' +
    '713924856' +
    '961537284' +
    '287419635' +
    '345286170'; // last cell is 0 → empty

/**
 * Returns the nth grid cell (0-based, row-major order).
 * The dynamic CSS classes (--selected, --error, etc.) live on the inner
 * <div class="grid-value"> rendered by grid-value.component.html,
 * NOT on the <grid-value> custom element itself.
 */
const tile = (index: number) => cy.get('div.grid__value-wrapper').eq(index);
const tileInner = (index: number) => tile(index).find('.grid-value');

describe('home — grid renders', () => {
    it('renders 81 grid cells', () => {
        cy.visit('/');
        cy.get('div.grid__value-wrapper').should('have.length', 81);
    });

    it('loads a puzzle from a URL parameter', () => {
        cy.visit(`/${PUZZLE_GRID}`);
        // Cell [0][0] = 5 (read-only pre-filled)
        tile(0).find('.grid-value__value').should('have.text', '5');
        // Cell [0][1] = 3 (read-only pre-filled)
        tile(1).find('.grid-value__value').should('have.text', '3');
        // Cell [0][2] = empty
        tile(2).find('.grid-value__value').should('not.exist');
    });
});

describe('home — cell interaction', () => {
    beforeEach(() => {
        cy.visit(`/${PUZZLE_GRID}`);
    });

    it('selects an empty cell on click', () => {
        // Cell [0][2] is empty → editable
        tile(2).click();
        tileInner(2).should('have.class', 'grid-value--selected');
    });

    it('does not select a read-only cell', () => {
        // Cell [0][0] = 5 is pre-filled and locked
        tile(0).click();
        tileInner(0).should('not.have.class', 'grid-value--selected');
    });

    it('enters a value by clicking the number pad', () => {
        tile(2).click();
        cy.get('[aria-label="Select nominee value 4"]').click();
        tile(2).find('.grid-value__value').should('have.text', '4');
    });

    it('enters a value via keyboard', () => {
        tile(2).click();
        // HostListener is on window:keydown — use trigger so the event reaches Angular
        cy.get('body').trigger('keydown', {key: '4', bubbles: true});
        tile(2).find('.grid-value__value').should('have.text', '4');
    });

    it('deletes a value with the Delete number button', () => {
        tile(2).click();
        cy.get('[aria-label="Select nominee value 4"]').click();
        tile(2).find('.grid-value__value').should('have.text', '4');

        cy.get('[aria-label="Delete a selected value"]').click();
        tile(2).find('.grid-value__value').should('not.exist');
    });

    it('clicking the same empty cell twice toggles nominees mode', () => {
        tile(2).click(); // select
        tile(2).click(); // second click → showNominees = true
        tileInner(2).should('have.class', 'grid-value--nominees');
    });
});

describe('home — nominees mode', () => {
    beforeEach(() => {
        cy.visit(`/${PUZZLE_GRID}`);
    });

    it('marks candidate numbers in a cell via the Nominees button', () => {
        tile(2).click();
        cy.get('[aria-label="Toggle field edit nominees"]').click();

        cy.get('[aria-label="Select nominee value 3"]').click();
        cy.get('[aria-label="Select nominee value 4"]').click();

        // Nominees grid is visible because the cell value is still null
        tile(2).find('.nominees-grid').should('be.visible');

        // The 9-slot array renders as spans; slots at index 2 and 3 hold values 3 and 4
        tile(2).find('.nominees-grid__value').eq(2).should('have.text', '3');
        tile(2).find('.nominees-grid__value').eq(3).should('have.text', '4');
    });

    it('toggling the same nominee twice removes it', () => {
        tile(2).click();
        cy.get('[aria-label="Toggle field edit nominees"]').click();

        cy.get('[aria-label="Select nominee value 3"]').click(); // add
        cy.get('[aria-label="Select nominee value 3"]').click(); // remove

        tile(2).find('.nominees-grid__value').eq(2).should('have.text', '');
    });

    it('entering a real value clears nominees from the same row and column', () => {
        // Add nominee 5 to cell [0][2]
        tile(2).click();
        cy.get('[aria-label="Toggle field edit nominees"]').click();
        cy.get('[aria-label="Select nominee value 5"]').click();

        // Move to cell [0][3], disable nominees mode, place value 5
        tile(3).click(); // showNominees stays true (different cell)
        cy.get('[aria-label="Toggle field edit nominees"]').click(); // showNominees → false
        cy.get('[aria-label="Select nominee value 5"]').click();

        // Nominee 5 should now be cleared from cell [0][2] (same row)
        tile(2).find('.nominees-grid__value').eq(4).should('have.text', '');
    });
});

describe('home — help mode', () => {
    beforeEach(() => {
        cy.visit(`/${PUZZLE_GRID}`);
    });

    it('highlights an erroneous cell in red when help is enabled', () => {
        tile(2).click(); // [0][2], correct = 4
        cy.get('[aria-label="Select nominee value 9"]').click(); // wrong value
        cy.get('[aria-label="Enable help"]').click();
        tileInner(2).should('have.class', 'grid-value--error');
    });

    it('marks a correctly filled cell with success styling', () => {
        tile(2).click(); // [0][2], correct = 4
        cy.get('[aria-label="Select nominee value 4"]').click(); // correct value
        cy.get('[aria-label="Enable help"]').click();
        tileInner(2).should('have.class', 'grid-value--success');
    });
});

describe('home — finishing the puzzle', () => {
    it('opens the success dialog when the last cell is filled correctly', () => {
        cy.visit(`/${NEARLY_COMPLETE_GRID}`);
        // Cell [8][8] = index 80, correct value = 9
        tile(80).click();
        cy.get('[aria-label="Select nominee value 9"]').click();
        cy.get('mat-dialog-container').should('be.visible');
        cy.get('mat-dialog-container').should('contain.text', 'Skrrr skrrr');
    });
});

describe('home — dialogs', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('opens the creation dialog when clicking Start a new game', () => {
        cy.get('[aria-label="Start a new game"]').click();
        cy.get('mat-dialog-container').should('be.visible');
        cy.get('mat-dialog-container').should('contain.text', 'Easy');
    });

    it('selecting a difficulty from the creation dialog resets the grid', () => {
        cy.get('[aria-label="Start a new game"]').click();
        cy.get('mat-dialog-container').contains('Easy').click();
        cy.get('mat-dialog-container').should('not.exist');
        cy.get('div.grid__value-wrapper').should('have.length', 81);
    });

    it('opens the share dialog when clicking Share sudoku', () => {
        cy.get('[aria-label="Share sudoku by url"]').click();
        cy.get('mat-dialog-container').should('be.visible');
    });
});

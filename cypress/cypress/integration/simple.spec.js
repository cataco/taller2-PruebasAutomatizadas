context('Habitica Tests', () => {

    it.skip('makes a wrong login attemp', () => {
        cy.visit('https://habitica.com/static/home')
        cy.get('#usernameInput').type('fake@email.com').should('have.value', 'fake@email.com');
        cy.get('#passwordInput').type('fake@email.com');
        cy.get('.btn-info[type="submit"]').click();
        cy.contains("Uh-oh - your email address / username or password is incorrect.").should('be.visible')
    });

    it('creates account', () => {
        cy.visit('https://habitica.com/static/home');
        cy.get('#usernameInput').type('fakeWorkshopUser124').should('have.value', 'fakeWorkshopUser124');
        cy.get('[type="email"]').type('fakeWorkshopUser124@email.com').should('have.value', 'fakeWorkshopUser124@email.com');
        cy.get('[placeholder="Password"]').type('FakeWorkshopUser124');
        cy.get('[placeholder="Confirm Password"]').type('FakeWorkshopUser124');
        cy.get('.btn-info[type="submit"]').click()
            .get("#avatar-modal___BV_modal_body_").should('be.visible');

    });

    it('creates account with existing user data', () => {
        cy.visit('https://habitica.com/static/home');
        cy.get('#usernameInput').type('fakeWorkshopUser124').should('have.value', 'fakeWorkshopUser124');
        cy.get('[type="email"]').type('fakeWorkshopUser124@email.com').should('have.value', 'fakeWorkshopUser124@email.com');
        cy.get('[placeholder="Password"]').type('FakeWorkshopUser124');
        cy.get('[placeholder="Confirm Password"]').type('FakeWorkshopUser124');
        cy.get('.btn-info[type="submit"]').should('be.disabled');
    });

    it('create public challenge', () => {
        login();
        cy.get('.nav-link[href="/challenges/myChallenges"]').click();
        cy.get('.create-challenge-button').click();
        cy.get('[placeholder="What is your Challenge name?"]').type('Cypress Public Challenge');
        cy.get('[placeholder="What short tag should be used to identify your Challenge?"]').type('Cypress Challenge');
        cy.get('.summary-count').type("This is a Cypress Challenge. Lorem Ipsum is simply dummy text of the printing and typesetting industry.");
        cy.get('.description-textarea').type("This is the description of my new cypress challenge");
        cy.get('select').select('00000000-0000-4000-A000-000000000000');
        /* This category box is never displayed when clicking on the category select
        cy.get('.category-select').click()
            .get('.category-box').should('be.visible')
            .get('#challenge-modal-cat-hobbies_occupations').click()
            .contains('Close').click();*/
        cy.get('[type="number"]').type('0');
        cy.contains('Add Challenge Tasks').click();
        //cy.get('.notifications-top-pos-normal').should('be.visible');
    });

    it('creates a new habit', () => {
        login();
        cy.get('#create-task-btn').click();
        cy.get('.create-task-btn .icon-habit').click();
        cy.get('.input-title').type('Watch Netflix');
        cy.get('.negative.mx-auto').click();
        cy.get('.btn-primary.btn-footer').click();
        cy.contains('Watch Netflix').should('be.visible');
    });

    it('creates a new daily task', () => {
        login();
        cy.get('#create-task-btn').click();
        cy.get('.create-task-btn .icon-daily').click();
        cy.get('.input-title').type('Study Cypress');
        cy.get('.btn-primary.btn-footer').click();
        cy.contains('Study Cypress').should('be.visible');
    });

    function login() {
        cy.visit('https://habitica.com/static/home');
        cy.get('.login-button').click();
        cy.get('#usernameInput').type('myname123fff');
        cy.get('#passwordInput').type('myname123fff');
        cy.get('.btn-info[type="submit"]').click();
    }
});

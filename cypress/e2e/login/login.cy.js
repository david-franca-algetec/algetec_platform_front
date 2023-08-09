/// <reference types="cypress" />

context(
  'Login and logout',
  {
    viewportWidth: 1366,
    viewportHeight: 625,
  },
  () => {
    before(() => {
      cy.visit('/');
    });

    it('.type() - type email and password', () => {
      cy.get('[data-cy="email"]').type('dfranca@algetec.com.br', { delay: 50 });
      cy.get('[data-cy="email"]').should('have.value', 'dfranca@algetec.com.br');
      cy.get('[data-cy="password"]').type('david.franca02', { delay: 50 });
      cy.get('[data-cy="password"]').should('have.value', 'david.franca02');
      cy.get('[data-cy="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  },
);

// https://on.cypress.io/api

describe('Home test', () => {
  it('clicking iniciar sesion navigates to login page', () => {
    cy.visit('/')
    cy.contains('Iniciar sesión').click()
    cy.url().should('include', '/login')
  })

  it('logins correctly as admin', function () {

    cy.visit('/login')
    cy.get('input[data-cy=username]').type('admin.j')

    cy.get('[data-cy=password]').type('admin')

    cy.get('[data-cy=submit-login]').click()

    cy.contains('admin.j')
    cy.get('[data-cy=nav-username]').should('contain', 'admin.j')
  })
})

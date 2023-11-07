// https://on.cypress.io/api

describe('Comments tests', () => {

    beforeEach(() => {
        cy.viewport(1280, 720)
        cy.visit('/login')
        cy.get('input[data-cy=username]').type('admin.j')

        cy.get('[data-cy=password]').type('admin')
        cy.get('[data-cy=submit-login]').click()
        cy.get('[data-cy=nav-username]').should('contain', 'admin.j')
    })

    it('trying to comment without writing and without selecting a rating ends up in an error', () => {
        cy.visit('/games/girl-in-the-forest')

        cy.get('[data-cy=comment]').click()

        cy.get('[data-cy=send-comment]').click()

        cy.get('[data-cy="comment-error"]').should('exist');

        cy.get('[data-cy="rating-error"]').should('exist');
    })

    it('comment flow, creating, editing and deleting a comment', () => {
        cy.visit('/games/girl-in-the-forest')

        //Comment

        cy.get('[data-cy=comment]').click()

        cy.get('[data-cy=comment-input]').type('This game is awesome!')

        cy.get('.p-rating-item').last().click();

        cy.get('[data-cy=send-comment]').click()

        //Assertions about comment

        cy.get('[data-cy=comment-content]').should('contain', 'This game is awesome!')

        cy.get('.p-rating-item')
            .last()
            .should('have.attr', 'data-p-active', 'true');

        //Edition

        cy.get('[data-cy=edit-comment]').click()

        cy.get('[data-cy=edit-comment-field]').type(' Best game ever made!')

        cy.get('[data-cy=edit-comment-button]').click()

        //Assertions about edition

        cy.get('[data-cy=comment-content]').should('contain', 'This game is awesome! Best game ever made!')

        //Deletion
        cy.get('[data-cy=delete-comment]').click()

        cy.contains('Sí. eliminar').click()

        //Assertions about detelion

        cy.contains('This game is awesome! Best game ever made!').should('not.exist');

    })
})
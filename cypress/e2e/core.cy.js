describe('Core function', function () {
  beforeEach(function () {
    cy.visit('localhost:3000/index.html');
  });

  it('should set the class', function () {
    cy.get('label[is="esc-label"]')
      .invoke('attr', 'class')
      .should('eq', '.esc-label.compact.err');
  });
});

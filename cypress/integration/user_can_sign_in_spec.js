describe("Authentication", () => {
  it("A user signs in and is redirected to /posts", () => {
    // sign up
    cy.visit("/users/new");
    cy.get("#name").type("Name");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#signup-button").click();

    // sign in
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#login-button").click();

    cy.url().should("include", "/posts");
    cy.contains("Post");
  });
});

// Basic auth creds (for site access)
const BASIC_AUTH = {
  username: Cypress.env("BASIC_AUTH_USER"),
  password: Cypress.env("BASIC_AUTH_PASS"),
};

// Always visit app with basic auth
Cypress.Commands.add("visitApp", (path = "/#/") => {
  cy.visit(path, { auth: BASIC_AUTH });
});

// Open Login modal
Cypress.Commands.add("openLoginModal", () => {
  cy.visitApp("/#/");

// there should be no modal at start
  cy.get("ngb-modal-window").should("not.exist");

  cy.contains("button", "Sign In").should("be.visible").click();
  cy.contains(".modal-title", "Log in").should("be.visible");
});

// login(email, password) via UI
Cypress.Commands.add("login", (email, password) => {
  cy.openLoginModal();

  cy.get("#signinEmail").clear().type(email);
  cy.get("#signinPassword").clear().type(password, { log: false });

  cy.contains("button", "Login").should("be.visible").click();
  cy.url().should("include", "/panel/garage");
});

// Open Registration modal
Cypress.Commands.add("openRegistrationModal", () => {
  cy.visitApp("/#/");

// Open Sign In modal window
  cy.contains("button", "Sign In").should("be.visible").click();

// Switch to Registration
  cy.contains("button", "Registration").should("be.visible").click();

// Check that we are definitely in Registration
  cy.contains(".modal-title", "Registration").should("be.visible");
});

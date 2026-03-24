/// <reference types="cypress" />

describe("HW 22.1 - Task 3 - intercept Profile name", () => {
  const userEmail = Cypress.env("USER_EMAIL");
  const userPassword = Cypress.env("USER_PASSWORD");

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.login(userEmail, userPassword);
    cy.url().should("include", "/panel/garage");
  });

  it("shows Polar Bear on Profile page after intercept", () => {
    cy.intercept("GET", "/api/users/profile", (req) => {
      req.continue((res) => {
        res.body.data.name = "Polar";
        res.body.data.lastName = "Bear";
      });
    }).as("getProfile");

    cy.contains("button", "My profile").should("be.visible").click();
    cy.contains("a", "Profile").should("be.visible").click();

    cy.wait("@getProfile");
    cy.url().should("include", "/panel/profile");
    cy.contains("Polar Bear").should("be.visible");
  });
});
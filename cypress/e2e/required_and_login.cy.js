/// <reference types="cypress" />

describe("HW 20.1 - Only failing tests (required + custom login)", () => {
  const openRegistrationModal = () => {
    cy.visitApp("/#/");
    cy.contains("button", "Sign In").should("be.visible").click();
    cy.contains(".modal-title", "Log in").should("be.visible");

    cy.contains("button", "Registration").should("be.visible").click();
    cy.contains(".modal-title", "Registration").should("be.visible");
  };

  const assertInvalidFeedbackByInputId = (inputId, expectedText) => {
    cy.get(inputId)
      .parents(".form-group")
      .find(".invalid-feedback")
      .should("be.visible")
      .and("contain.text", expectedText);
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("shows required errors for empty fields", () => {
    openRegistrationModal();

    cy.get("#signupName").focus().blur();
    cy.get("#signupLastName").focus().blur();
    cy.get("#signupEmail").focus().blur();
    cy.get("#signupPassword").focus().blur();
    cy.get("#signupRepeatPassword").focus().blur();

    assertInvalidFeedbackByInputId("#signupName", "Name required");
    assertInvalidFeedbackByInputId("#signupLastName", "Last name required");
    assertInvalidFeedbackByInputId("#signupEmail", "Email required");
    assertInvalidFeedbackByInputId("#signupPassword", "Password required");
    assertInvalidFeedbackByInputId("#signupRepeatPassword", "Re-enter password required");
  });

  it("cy.login() logs in via UI", () => {
    const email = Cypress.env("USER_EMAIL");
    const password = Cypress.env("USER_PASSWORD");

    expect(email, "USER_EMAIL is set").to.be.a("string").and.not.be.empty;
    expect(password, "USER_PASSWORD is set").to.be.a("string").and.not.be.empty;

    cy.login(email, password);

    cy.contains("a", "Log out").should("be.visible").click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });
});

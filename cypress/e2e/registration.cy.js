/// <reference types="cypress" />

describe("HW 20.1 - Registration tests (validations + success) + custom login()", () => {

  const selectors = {
    name: "#signupName",
    lastName: "#signupLastName",
    email: "#signupEmail",
    password: "#signupPassword",
    repeatPassword: "#signupRepeatPassword",
    registerBtn: 'button.btn.btn-primary[type="button"]', // кнопка Register в модалці
  };

  const uniqueEmail = () =>
    `inna_${Date.now()}_${Math.floor(Math.random() * 10000)}@mail.com`;

  const triggerRequired = (selector) => {
    cy.get(selector).should("be.visible").focus().type("a").clear().blur();
  };

  const assertFieldError = (selector, expectedText) => {
    cy.get(selector)
      .parents(".form-group")
      .first()
      .find(".invalid-feedback")
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.contain(expectedText);
      });
  };

  const fillRegistrationForm = ({ name, lastName, email, password, repeatPassword }) => {
    cy.get(selectors.name).should("be.visible").clear().type(name);
    cy.get(selectors.lastName).should("be.visible").clear().type(lastName);
    cy.get(selectors.email).should("be.visible").clear().type(email);

    cy.get(selectors.password).should("be.visible").clear().type(password, { log: false });
    cy.get(selectors.repeatPassword)
      .should("be.visible")
      .clear()
      .type(repeatPassword, { log: false });
  };

  const logoutFromPanel = () => {
    cy.contains("a", "Log out").should("be.visible").click();
    cy.contains("button", "Sign In").should("be.visible");
  };

  beforeEach(() => {
    cy.openRegistrationModal();
    cy.contains(".modal-title", "Registration").should("be.visible");
  });

  // Required validations

  it("shows required errors for empty fields", () => {

    triggerRequired(selectors.name);
    assertFieldError(selectors.name, "Name required");

    triggerRequired(selectors.lastName);
    assertFieldError(selectors.lastName, "Last name required");

    triggerRequired(selectors.email);
    assertFieldError(selectors.email, "Email required");

    triggerRequired(selectors.password);
    assertFieldError(selectors.password, "Password required");

    triggerRequired(selectors.repeatPassword);
    assertFieldError(selectors.repeatPassword, "Re-enter password required");
  });


  // Name validations

  it('validates Name - wrong data shows "Name is invalid"', () => {
    cy.get(selectors.name).clear().type("Інна").blur();
    assertFieldError(selectors.name, "Name is invalid");
  });

  it("validates Name - wrong length (<2) shows length error", () => {
    cy.get(selectors.name).clear().type("A").blur();
    assertFieldError(selectors.name, "Name has to be from 2 to 20 characters long");
  });

  it("validates Name - wrong length (>20) shows length error", () => {
    cy.get(selectors.name).clear().type("A".repeat(21)).blur();
    assertFieldError(selectors.name, "Name has to be from 2 to 20 characters long");
  });

  // Last name validations
  it('validates Last name - wrong data shows "Last name is invalid"', () => {
    cy.get(selectors.lastName).clear().type("Онос").blur();
    assertFieldError(selectors.lastName, "Last name is invalid");
  });

  it("validates Last name - wrong length (<2) shows length error", () => {
    cy.get(selectors.lastName).clear().type("B").blur();
    assertFieldError(selectors.lastName, "Last name has to be from 2 to 20 characters long");
  });

  it("validates Last name - wrong length (>20) shows length error", () => {
    cy.get(selectors.lastName).clear().type("B".repeat(21)).blur();
    assertFieldError(selectors.lastName, "Last name has to be from 2 to 20 characters long");
  });


  // Email validations
  it('validates Email - incorrect format shows "Email is incorrect"', () => {
    cy.get(selectors.email).clear().type("test@").blur();
    assertFieldError(selectors.email, "Email is incorrect");
  });

  // Password validations
  it("validates Password - weak/short password shows rules error", () => {
    cy.get(selectors.password).clear().type("qwerty", { log: false }).blur();

    assertFieldError(selectors.password, "Password has to be from 8 to 15 characters long");
  });

  it('validates Re-enter password - mismatch shows "Passwords do not match"', () => {
    cy.get(selectors.password).clear().type("Qwerty1a", { log: false }).blur();
    cy.get(selectors.repeatPassword).clear().type("Qwerty1b", { log: false }).blur();

    assertFieldError(selectors.repeatPassword, "Passwords do not match");
  });

  // Successful registration
  it("registers successfully with unique email and logs user in (Garage)", () => {
    const email = uniqueEmail();
    const password = "Qwerty1a";

    fillRegistrationForm({
      name: "Inna",
      lastName: "Test",
      email,
      password,
      repeatPassword: password,
    });

    cy.contains("button", "Register").should("be.visible").and("not.be.disabled").click();

    cy.url().should("include", "/panel/garage");
    cy.contains("h1", "Garage").should("be.visible");
  });

  // Custom command login()
  it("custom command cy.login() logs in via UI (newly created user)", () => {
    const email = uniqueEmail();
    const password = "Qwerty1a";

    // 1) Register new user
    fillRegistrationForm({
      name: "Inna",
      lastName: "Test",
      email,
      password,
      repeatPassword: password,
    });

    cy.contains("button", "Register").should("be.visible").and("not.be.disabled").click();
    cy.url().should("include", "/panel/garage");

    // 2) Logout
    logoutFromPanel();

    // 3) Login
    cy.login(email, password);

    cy.url().should("include", "/panel/garage");
    cy.contains("h1", "Garage").should("be.visible");
  });
});

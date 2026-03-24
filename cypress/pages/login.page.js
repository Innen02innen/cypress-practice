export class LoginPage {
  open() {
    cy.visit("/#/", {
      auth: {
        username: "guest",
        password: "welcome2qauto",
      },
    });
  }

  clickSignIn() {
    cy.contains("button", "Sign In").click();
  }

  fillEmail(email) {
    cy.get("#signinEmail").clear().type(email);
  }

  fillPassword(password) {
    cy.get("#signinPassword").clear().type(password, { log: false });
  }

  clickLogin() {
    cy.contains("button", "Login").click();
  }

  login(email, password) {
    this.open();
    this.clickSignIn();
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickLogin();
  }
}
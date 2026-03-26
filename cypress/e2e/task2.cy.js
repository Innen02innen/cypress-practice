/// <reference types="cypress" />

import { LoginPage } from "../pages/login.page";
import { GaragePage } from "../pages/garage.page";

describe("HW 22.1 - Task 2 - delete created cars after Garage tests", () => {
  const loginPage = new LoginPage();
  const garagePage = new GaragePage();

  const userEmail = Cypress.env("USER_EMAIL");
  const userPassword = Cypress.env("USER_PASSWORD");

  let createdCarId = null;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    loginPage.login(userEmail, userPassword);
    cy.url().should("include", "/panel/garage");
  });

  afterEach(() => {
    if (createdCarId) {
      cy.deleteCarByApi(createdCarId);
      createdCarId = null;
    }
  });

  it("adds a car in Garage and deletes it by API in post-condition", () => {
    cy.intercept("POST", "/api/cars").as("createCar");

    garagePage.addCar({
      brand: "Audi",
      model: "TT",
      mileage: 100,
    });

    cy.wait("@createCar").then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      createdCarId = interception.response.body.data.id;
      expect(createdCarId).to.be.a("number");
    });

    garagePage.assertCarVisible("Audi TT");
  });
});
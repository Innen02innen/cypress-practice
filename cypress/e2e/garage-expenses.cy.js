/// <reference types="cypress" />

import { LoginPage } from "../pages/login.page";
import { GaragePage } from "../pages/garage.page";
import { ExpensesPage } from "../pages/expenses.page";

describe("HW 21.1 - Garage and fuel expenses", () => {
  const loginPage = new LoginPage();
  const garagePage = new GaragePage();
  const expensesPage = new ExpensesPage();

  const userEmail = Cypress.env("USER_EMAIL");
  const userPassword = Cypress.env("USER_PASSWORD");

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    // Логін
    loginPage.login(userEmail, userPassword);

    // Перевірка що ми в гаражі
    cy.url().should("include", "/panel/garage");
  });

  it("adds a car in garage", () => {
    garagePage.addCar({
      brand: "Audi",
      model: "TT",
      mileage: 100,
    });

    // Перевіряємо що машина додалась
    garagePage.assertCarVisible("Audi TT");
  });

  it("adds fuel expense for created car", () => {
    // 1. Додаємо машину
    garagePage.addCar({
      brand: "Audi",
      model: "TT",
      mileage: 100,
    });

    garagePage.assertCarVisible("Audi TT");

    // 2. Відкриваємо форму витрат
    garagePage.openAddFuelExpense();

    // 3. Додаємо витрати (дата вже обробляється всередині page)
    expensesPage.addExpense({
      mileage: 120,
      liters: 20,
      totalCost: 1000,
    });

    // 4. Переходимо в список витрат
    expensesPage.openExpensesPage();

    // 5. Перевіряємо що витрата є
    expensesPage.assertExpenseVisible(1000);
  });
});
export class ExpensesPage {
  getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  openExpensesPage() {
    cy.contains("a", "Fuel expenses").should("be.visible").click();
    cy.url().should("include", "/panel/expenses");
  }

  fillReportDate(date) {
    cy.get("#addExpenseDate")
      .should("be.visible")
      .clear()
      .type(date);
  }

  fillMileage(mileage) {
    cy.get("#addExpenseMileage")
      .should("be.visible")
      .clear()
      .type(String(mileage));
  }

  fillLiters(liters) {
    cy.get("#addExpenseLiters")
      .should("be.visible")
      .clear()
      .type(String(liters));
  }

  fillTotalCost(totalCost) {
    cy.get("#addExpenseTotalCost")
      .should("be.visible")
      .clear()
      .type(String(totalCost));
  }

  clickAddExpense() {
    cy.get("ngb-modal-window")
      .should("be.visible")
      .within(() => {
        cy.contains("button", /^Add$/).should("be.visible").click();
      });
  }

  addExpense({ mileage, liters, totalCost, reportDate }) {
    const safeDate = reportDate || this.getYesterdayDate();

    this.fillReportDate(safeDate);
    this.fillMileage(mileage);
    this.fillLiters(liters);
    this.fillTotalCost(totalCost);
    this.clickAddExpense();

    cy.get("ngb-modal-window").should("not.exist");
  }

  assertExpenseVisible(totalCost) {
    cy.contains(String(totalCost)).should("be.visible");
  }
}
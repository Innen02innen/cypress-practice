export class GaragePage {
  clickAddCar() {
    cy.contains("button", "Add car").should("be.visible").click();
    cy.get("ngb-modal-window").should("be.visible");
  }

  selectBrand(brand) {
    cy.get("#addCarBrand").should("be.visible").select(brand);
  }

  selectModel(model) {
    cy.get("#addCarModel").should("be.visible").select(model);
  }

  fillMileage(mileage) {
    cy.get("#addCarMileage").should("be.visible").clear().type(String(mileage));
  }

  saveCar() {
    cy.get("ngb-modal-window")
      .should("be.visible")
      .within(() => {
        cy.contains("button", /^Add$/).should("be.visible").click();
      });
  }

  addCar({ brand, model, mileage }) {
    this.clickAddCar();
    this.selectBrand(brand);
    this.selectModel(model);
    this.fillMileage(mileage);
    this.saveCar();
  }

  openAddFuelExpense() {
    cy.contains("button", "Add fuel expense").first().should("be.visible").click();
    cy.get("ngb-modal-window").should("be.visible");
  }

  assertCarVisible(carName) {
    cy.contains(carName).should("be.visible");
  }
}
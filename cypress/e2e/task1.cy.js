/// <reference types="cypress" />

describe("HW 22.1 - Task 1 - API tests for Cars", () => {
  const userEmail = Cypress.env("USER_EMAIL");
  const userPassword = Cypress.env("USER_PASSWORD");

  let createdCarId = null;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.login(userEmail, userPassword);
    cy.url().should("include", "/panel/garage");
  });

  afterEach(() => {
    if (createdCarId) {
      cy.request({
        method: "DELETE",
        url: `/api/cars/${createdCarId}`,
        failOnStatusCode: false,
      });
      createdCarId = null;
    }
  });

  it("GET /api/cars returns list of cars", () => {
    cy.request("GET", "/api/cars").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq("ok");
      expect(response.body.data).to.be.an("array");
    });
  });

  it("POST /api/cars creates a new car", () => {
    cy.request({
      method: "POST",
      url: "/api/cars",
      body: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 111,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.status).to.eq("ok");
      expect(response.body.data).to.include({
        carBrandId: 1,
        carModelId: 1,
        mileage: 111,
      });

      createdCarId = response.body.data.id;
      expect(createdCarId).to.be.a("number");
    });
  });

  it("GET /api/cars contains created car", () => {
    cy.request({
      method: "POST",
      url: "/api/cars",
      body: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 222,
      },
    }).then((createResponse) => {
      createdCarId = createResponse.body.data.id;

      cy.request("GET", "/api/cars").then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.status).to.eq("ok");

        const createdCar = getResponse.body.data.find((car) => car.id === createdCarId);

        expect(createdCar).to.exist;
        expect(createdCar.mileage).to.eq(222);
        expect(createdCar.carBrandId).to.eq(1);
        expect(createdCar.carModelId).to.eq(1);
      });
    });
  });

  it("PUT /api/cars updates created car mileage", () => {
    cy.request({
      method: "POST",
      url: "/api/cars",
      body: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 333,
      },
    }).then((createResponse) => {
      createdCarId = createResponse.body.data.id;

      cy.request({
        method: "PUT",
        url: `/api/cars/${createdCarId}`,
        body: {
          carBrandId: 1,
          carModelId: 1,
          mileage: 444,
        },
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.status).to.eq("ok");
        expect(updateResponse.body.data.id).to.eq(createdCarId);
        expect(updateResponse.body.data.mileage).to.eq(444);
      });
    });
  });

  it("DELETE /api/cars deletes created car", () => {
    cy.request({
      method: "POST",
      url: "/api/cars",
      body: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 555,
      },
    }).then((createResponse) => {
      const carId = createResponse.body.data.id;

      cy.request({
        method: "DELETE",
        url: `/api/cars/${carId}`,
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body.status).to.eq("ok");
      });

      createdCarId = null;
    });
  });
});
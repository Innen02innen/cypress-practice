describe("HW 19.1 - Cypress queries", () => {
  beforeEach(() => {
    // Setup: відкриваємо застосунок через hash-роут + Basic Auth
    cy.visit("/#/", {
      auth: { username: "guest", password: "welcome2qauto" },
    });

    // Перевірка, що сторінка реально завантажилась
    cy.get("body").should("be.visible");
  });

  // Тест 1: одинарний елемент (header) — знаходимо header і перевіряємо, що він видимий
  it("Single element: header exists and is visible", () => {
    cy.get("header").should("exist").and("be.visible");
  });

  // Тест 2: одинарний елемент (кнопка Sign In) — знаходимо кнопку і перевіряємо що видима
  it("Single element by selector: 'Sign In' button is visible", () => {
    cy.get("button.header_signin").should("exist").and("be.visible");
  });

  // Тест 3: множинні елементи — перевіряємо, що на сторінці є навігаційні лінки в хедері
  it("Multiple elements: header navigation links count > 0", () => {
    cy.get("header a").its("length").should("be.greaterThan", 0);
  });

  // Тест 4: find() всередині контейнера — в header знаходимо кнопку Sign In
  it("Use find(): header contains Sign In button", () => {
    cy.get("header").find("button.header_signin").should("exist").and("be.visible");
  });

  // Тест 5: filter() — серед усіх кнопок сторінки беремо тільки видимі, їх має бути > 0
  it("Use filter(): visible buttons count > 0", () => {
    cy.get("button").filter(":visible").its("length").should("be.greaterThan", 0);
  });
});
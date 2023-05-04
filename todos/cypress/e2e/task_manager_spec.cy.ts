describe("Task Manager", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("adds a task", () => {
    cy.get('input[placeholder="Add a task"]').type("Parent Task{enter}");
    cy.contains("Parent Task").should("be.visible");
  });

  it("adds a nested task", () => {
    cy.get('input[placeholder="Add a task"]').type("Parent Task{enter}");
    cy.contains("Select this task to add more").click();
    cy.get('input[placeholder="Add a task"]').type("Child Task{enter}");
    cy.contains("Child Task").should("be.visible");
  });

  it("searches for nested tasks", () => {
    cy.get('input[placeholder="Add a task"]').type("Parent Task{enter}");
    cy.contains("Select this task to add more").click();
    cy.get('input[placeholder="Add a task"]').type("Child Task{enter}");

    cy.get('input[placeholder="Search tasks"]').type("Child");
    cy.contains("Child Task").should("be.visible");
    cy.contains("Parent Task").should("not.exist");
  });

  it("removes a parent task and its nested tasks", () => {
    cy.get('input[placeholder="Add a task"]').type("Parent Task{enter}");
    cy.contains("Select this task to add more").click();
    cy.get('input[placeholder="Add a task"]').type("Child Task{enter}");

    cy.contains("Mark as Done").click();
    cy.contains("Parent Task").should("not.exist");
    cy.contains("Child Task").should("not.exist");
  });

  it("removes a nested task", () => {
    cy.get('input[placeholder="Add a task"]').type("Parent Task{enter}");
    cy.contains("Select this task to add more").click();
    cy.get('input[placeholder="Add a task"]').type("Child Task{enter}");

    cy.contains("Child Task")
      .parent()
      .within(() => {
        cy.contains("Mark as Done").click();
      });

    cy.contains("Child Task").should("not.exist");
  });
});

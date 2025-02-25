import inquirer from "inquirer";

import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employee_tracker",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

await pool.connect();
const connection = pool;

function viewAllDepartments() {
  // Logic to view all departments
  console.log("Viewing all departments...");
  //   Example: Fetch and display departments from the database
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results.rows);
    mainMenu();
  });
}

function viewAllRoles() {
  // Logic to view all roles
  console.log("Viewing all roles...");
  //   Example: Fetch and display roles from the database
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results.rows);
    mainMenu();
  });
}

function viewAllEmployees() {
  // Logic to view all employees
  console.log("Viewing all employees...");
  //   Example: Fetch and display employees from the database
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    console.table(results.rows);
    mainMenu();
  });
}

function addDepartment() {
  // Logic to add a department
  console.log("Adding a department...");
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the new department:",
      },
    ])
    .then((answers) => {
      // Example: Insert the new department into the database
      connection.query(
        "INSERT INTO department (name) VALUES ($1)",
        [answers.departmentName],
        (err, results) => {
          if (err) throw err;
          console.log("Department added successfully!");
          mainMenu();
        }
      );
    });
}

function addRole() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    const departments = res.rows.map((dept) => ({
      name: dept.name,
      value: dept.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the role title:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for this role:",
        },
        {
          type: "list",
          name: "department_id",
          message: "Select the department for this role:",
          choices: departments,
        },
      ])
      .then((answers) => {
        connection.query(
          "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
          [answers.title, answers.salary, answers.department_id],
          (err) => {
            if (err) throw err;
            console.log("Role added successfully!");
            mainMenu();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    const roles = res.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      const managers = res.rows.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      }));
      managers.push({ name: "None", value: null });

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Enter the employee's first name:",
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter the employee's last name:",
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the employee's role:",
            choices: roles,
          },
          {
            type: "list",
            name: "manager_id",
            message: "Select the employee's manager:",
            choices: managers,
          },
        ])
        .then((answers) => {
          connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
            [
              answers.first_name,
              answers.last_name,
              answers.role_id,
              answers.manager_id,
            ],
            (err) => {
              if (err) throw err;
              console.log("Employee added successfully!");
              mainMenu();
            }
          );
        });
    });
  });
}

function updateEmployeeRole() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employees = res.rows.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));

    connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      const roles = res.rows.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            message: "Select the employee whose role you want to update:",
            choices: employees,
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the new role:",
            choices: roles,
          },
        ])
        .then((answers) => {
          connection.query(
            "UPDATE employee SET role_id = $1 WHERE id = $2",
            [answers.role_id, answers.employee_id],
            (err) => {
              if (err) throw err;
              console.log("Employee role updated successfully!");
              mainMenu();
            }
          );
        });
    });
  });
}

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "view all departments":
          viewAllDepartments();
          break;
        case "view all roles":
          viewAllRoles();
          break;
        case "view all employees":
          viewAllEmployees();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          updateEmployeeRole();
          break;
      }
    });
}

mainMenu();

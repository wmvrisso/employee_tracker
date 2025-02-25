insert into department (name) values
('Sales'),
('Engineering'),
('Finance'),
('Human Resources');

insert into role (title, salary, department_id) values
('Sales Manager', 80000, 1),
('Software Engineer', 90000, 2),
('Financial Analyst', 70000, 3),
('HR Specialist', 60000, 4);

insert into employee (first_name, last_name, role_id, manager_id) values
('John', 'Doe', 1, null),
('Jane', 'Smith', 2, 1),
('Alice', 'Johnson', 3, 1),
('Bob', 'Brown', 4, 2);
create database employee_tracker;
\c employee_tracker;

create table department (
    id serial primary key,
    name varchar(50) not null
);
create table role (
    id serial primary key,
    title varchar(50) not null,
    salary numeric(10, 2) not null,
    department_id integer references department(id)
);
create table employee (
    id serial primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    role_id integer references role(id),
    manager_id integer references employee(id)
);
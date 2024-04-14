# Backend Development Exercise

## Challenge Description

This repository is developed as part of a backend development challenge to demonstrate:

- Backend development skills using Node.js and TypeScript.
- Ability to integrate with a PostgreSQL database.
- Proficiency in creating RESTful APIs to perform CRUD operations.
- Writing and running unit tests using Jest.

Time allocated for this challenge: 1 hour.

## Application Overview

The application is a simple web server created using Node.js and Express. It includes:

- An API endpoint `/awesome/applicant` that returns predefined personal information.
- Full CRUD operations on applicant data stored in a PostgreSQL database.
- Comprehensive unit tests for all routes.

## Technical Stack

- **Node.js**: JavaScript runtime for executing JavaScript on the server.
- **Express.js**: Web application framework for Node.js.
- **PostgreSQL**: Relational database to store applicant data.
- **Jest**: Testing framework for unit tests.
- **TypeScript**: A superset of JavaScript that adds static types.

## Setup Instructions

### Prerequisites

- Node.js installed on your machine.
- PostgreSQL installed and running on your machine.
- A PostgreSQL user with necessary privileges.

### Cloning the Repository

Start by cloning the repository to your local machine by running:

```bash
git clone https://github.com/britelink/Full-Stack-Challenges/tree/main/backend-challenge-nathanbirch
cd backend-challenge-nathanbirch
```

### Installing Dependencies

Use `pnpm` to install the required dependencies:

```bash
pnpm install
```

### Setting Up the Environment

Create a `.env` file in the root directory of the project and populate it with the necessary environment variables:

```plaintext
PGUSER=yourUsername
PGHOST=localhost
PGDATABASE=yourDatabaseName
PGPASSWORD=yourPassword
PGPORT=5432
PORT=3000  # The port your app will run on
```

### Database Setup

Execute the following SQL commands to set up the required database and tables:

```sql
CREATE DATABASE yourDatabaseName;

CREATE TABLE applicants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    bio TEXT,
    experience TEXT
);

INSERT INTO applicants (name, bio, experience) VALUES
('Your Name', 'Your bio here', 'Your experience here');
```

### Running the Application

To start the server, use:

```bash
pnpm start
```

This command will start the development server on `http://localhost:3000` (or another port specified in the `.env` file).

### Running Tests

To run the unit tests set up with Jest, use:

```bash
pnpm test
```

This command will execute all tests and display the results.

## API Endpoints

- `GET /awesome/applicant`: Retrieves applicant data.
- `POST /awesome/applicant`: Creates a new applicant record.
- `PATCH /awesome/applicant/:id`: Updates an existing applicant record.
- `DELETE /awesome/applicant/:id`: Deletes an existing applicant record.

## Contact

For any additional questions or feedback, please contact [tinotendajoe01](x.com/tinotendajoe01).

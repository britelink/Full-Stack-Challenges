import "dotenv/config";
import express from "express";
import { Pool } from "pg";

// Define an interface for errors with a status property.
interface ErrorWithStatus extends Error {
  status?: number;
}

// Initialize a new pool of PostgreSQL connections using environment variables.
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "5432"),
});

// Set up the express application.
const app: express.Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware to parse JSON request bodies.
app.use(express.json());

// Async route handler to wrap each route for error handling.
function asyncRouteHandler(
  fn: (req: express.Request, res: express.Response) => Promise<any>
) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => fn(req, res).catch(next);
}

// Route to create an applicant.
app.post(
  "/awesome/applicant",
  asyncRouteHandler(async (req, res) => {
    const { name, bio, experience } = req.body;
    const result = await pool.query(
      "INSERT INTO applicants (name, bio, experience) VALUES ($1, $2, $3) RETURNING *",
      [name, bio, experience]
    );
    res.status(201).json(result.rows[0]);
  })
);

// Route to retrieve all applicants.
app.get(
  "/awesome/applicant",
  asyncRouteHandler(async (req, res) => {
    const dbRes = await pool.query("SELECT * FROM applicants");
    res.json(dbRes.rows);
  })
);

// Route to update an applicant by ID.
app.patch(
  "/awesome/applicant/:id",
  asyncRouteHandler(async (req, res) => {
    const { id } = req.params;
    const { name, bio, experience } = req.body;
    const result = await pool.query(
      "UPDATE applicants SET name = $1, bio = $2, experience = $3 WHERE id = $4 RETURNING *",
      [name, bio, experience, id]
    );
    if (result.rows.length === 0) {
      res.status(404).send("Applicant not found");
    } else {
      res.json(result.rows[0]);
    }
  })
);

// Route to delete an applicant by ID.
app.delete(
  "/awesome/applicant/:id",
  asyncRouteHandler(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM applicants WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).send("Applicant not found");
    } else {
      res.status(204).send(); // Successfully deleted with no content to return.
    }
  })
);

// Generic error handling middleware.
app.use(
  (
    err: ErrorWithStatus,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).send(err.message || "Server error");
  }
);

// Start the server and listen on the specified port.
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}/`);
});

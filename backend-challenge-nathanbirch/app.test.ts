import request from "supertest";
import { app } from ".";

// Mocking the PostgreSQL module
jest.mock("pg", () => ({
  Pool: jest.fn(() => ({
    query: jest.fn((queryText, params) => {
      if (queryText.includes("SELECT * FROM applicants")) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              name: "James Joe",
              bio: "Developer",
              experience: "Some Experience",
            },
          ],
        });
      } else if (queryText.startsWith("INSERT INTO")) {
        return Promise.resolve({
          rows: [
            { id: 2, name: params[0], bio: params[1], experience: params[2] },
          ],
        });
      } else if (queryText.startsWith("UPDATE")) {
        return params[3] === "1"
          ? Promise.resolve({
              rows: [
                {
                  id: 1,
                  name: params[0],
                  bio: params[1],
                  experience: params[2],
                },
              ],
            })
          : Promise.resolve({ rowCount: 0 });
      } else if (queryText.startsWith("DELETE")) {
        return params[0] === "1"
          ? Promise.resolve({ rowCount: 1 })
          : Promise.resolve({ rowCount: 0 });
      }
      throw new Error("Query not handled in mock");
    }),
    end: jest.fn(),
  })),
}));

describe("Applicant API", () => {
  describe("GET /awesome/applicant", () => {
    it("should return a list of applicants", async () => {
      const response = await request(app).get("/awesome/applicant");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        {
          id: 1,
          name: "James Joe",
          bio: "Developer",
          experience: "Some Experience",
        },
      ]);
    });
  });

  describe("POST /awesome/applicant", () => {
    it("should create a new applicant", async () => {
      const newApplicant = {
        name: "Sara Joe",
        bio: "Developer",
        experience: "Entry level",
      };
      const response = await request(app)
        .post("/awesome/applicant")
        .send(newApplicant);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ id: 2, ...newApplicant });
    });
  });

  describe("PATCH /awesome/applicant/:id", () => {
    it("should update an existing applicant", async () => {
      const updatedApplicant = {
        name: "Updated James Joe",
        bio: "Senior Developer",
        experience: "Extensive Experience",
      };
      const response = await request(app)
        .patch("/awesome/applicant/1")
        .send(updatedApplicant);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedApplicant });
    });

    it("should return 404 if applicant not found", async () => {
      const response = await request(app).patch("/awesome/applicant/2").send({
        name: "Nonexistent",
        bio: "No Bio",
        experience: "No Experience",
      });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("Applicant not found");
    });
  });

  describe("DELETE /awesome/applicant/:id", () => {
    it("should delete an existing applicant", async () => {
      const response = await request(app).delete("/awesome/applicant/1");
      expect(response.statusCode).toBe(204);
    });

    it("should return 404 if applicant not found", async () => {
      const response = await request(app).delete("/awesome/applicant/2");
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("Applicant not found");
    });
  });
});

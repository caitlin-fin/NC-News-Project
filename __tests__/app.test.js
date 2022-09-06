const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: responds with an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });
  test("200: responds with array of objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { body } = response;
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("404: responds with error when given bad path", () => {
    return request(app)
      .get("/api/test")
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(response.body).toEqual({ msg: "path does not exist!" });
      });
  });
});

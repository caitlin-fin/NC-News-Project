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
        expect(body.topics.length).toEqual(3);
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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with article object of given id and formatted date (created_at)", () => {
    const expectedOutput = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { body } = response;
        console.log(body.article);
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toEqual(expectedOutput);
      });
  });
  test("404: responds with error message if article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/50")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "article doesn't exist" });
      });
  });
  test("404: responds with error message if article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not_valid")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "article_id not valid" });
      });
  });
});

// check for invalid articles (eg. /api/articles/not_valid)

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
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
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

describe("GET /api/users", () => {
  test("200: responds with array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.users.length).toEqual(4);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
  test("404: responds with error when given bad path", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "path does not exist!" });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: responds with object containing key with article data", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(201)
      .then((response) => {
        const { article } = response.body;
        expect(article !== undefined).toBe(true);
        expect(article.hasOwnProperty("votes")).toBe(true);
      });
  });
  test("201: responds with object and and updates vote count", () => {
    const updateVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(201)
      .then((response) => {
        const { article } = response.body;
        expect(article.votes).toBe(95);
      });
  });
  test("400: response with bad request message and error when passed invalid vote count", () => {
    const updateVotes = { inc_votes: "five" };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "bad request" });
      });
  });
  test("400: responds with error message if article_id is invalid", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/one")
      .send(updateVotes)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "bad request" });
      });
  });
  test("404: responds with error message if article does not exist but article_id is valid", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/99")
      .send(updateVotes)
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ msg: "article doesn't exist" });
      });
  });
  test("400: responds with error message when inc_vote is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send()
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual({ msg: "bad request" });
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("200: response is article object that includes comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.article).toHaveProperty("comment_count");
      });
  });
  test("200: response object contains accurate comment count for article with comments", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.article.comment_count).toEqual(11);
      });
  });
  test("200: response object contains accurate comment count of 0 for article without comments", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.article.comment_count).toEqual(0);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        console.log(body.articles);
        expect(Array.isArray(body.articles)).toBe(true);
      });
  });
  test("200: response objects in articles array have specific properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.articles.length).toEqual(12);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("200: responds with array of articles sorted in alphabetical order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { body } = response;
        console.log(body.articles);
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
  test.todo("accepts topic query");
});
// an articles array of article objects, each of which should have the following properties:

// The end point should also accept the following query:
// - topic, which filters the articles by the topic value specified in the query. If the query is omitted the endpoint should respond with all articles.

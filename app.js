const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topics.controller");
const { getArticle, patchArticle } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticle)

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "path does not exist!" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err.msg);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "unhandled!");
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;

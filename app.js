const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");

app.get("/api/topics", getTopics);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "path does not exist!" });
});

app.use((err, req, res, next) => {
  console.log(err, "unhandled!");
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;

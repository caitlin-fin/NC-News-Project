const topics = require("../db/data/test-data/topics");
const {
  selectArticle,
  updateArticle,
  selectArticles,
} = require("../models/articles.model");
const { checkTopics, checkTopicsExist } = require("../models/topics.model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    res.status(404).send({ msg: "article_id not valid" });
  } else {
    selectArticle(article_id).then((output) => {
      if (output === undefined) {
        res.status(404).send({ msg: "article doesn't exist" });
      } else {
        res.status(200).send({ article: output });
      }
    });
  }
};

exports.getArticlesArr = (req, res, next) => {
  const { topic } = req.query;

  if (isNaN(topic) === false) {
    return Promise.reject({ status: 400, msg: "bad request" }).catch(next);
  }

  if (topic !== undefined) {
    checkTopicsExist(topic).then((result) => {
      if (result === true) {
        selectArticles(topic).then((articles) => {
          res.status(200).send({ articles });
        });
      } else if (result === false) {
        return Promise.reject({
          status: 404,
          msg: "topic doesn't exist",
        }).catch(next);
      }
    });
  }

  if (topic === undefined) {
    selectArticles(topic).then((articles) => {
      res.status(200).send({ articles });
    });
  }
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (isNaN(inc_votes) || isNaN(article_id)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    updateArticle(article_id, inc_votes)
      .then((updatedArticle) => {
        res.status(201).send({ article: updatedArticle });
      })
      .catch(next);
  }
};

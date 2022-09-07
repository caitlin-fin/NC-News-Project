const { selectArticle, updateArticle } = require("../models/articles.model");

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

exports.patchArticle = (req, res) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (isNaN(inc_votes) || isNaN(article_id)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    updateArticle(article_id, inc_votes).then((updatedArticle) => {
      if (updatedArticle === undefined) {
        res.status(404).send({ msg: "article doesn't exist" });
      } else {
        res.status(201).send({ article: updatedArticle });
      }
    });
  }
};

const { selectArticle, updateArticles } = require("../models/articles.model");

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

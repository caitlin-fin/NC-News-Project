const { selectArticle } = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((output) => {
      if (output === undefined) {
        res.status(404).send({msg: "article doesn't exist"})
      } else {
      res.status(200).send({ article: output });
      }
    })
};

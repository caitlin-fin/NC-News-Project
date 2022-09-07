const { selectArticle, updateArticles } = require("../models/articles.model");
const { countComments } = require("../models/comments.model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    res.status(404).send({ msg: "article_id not valid" });
  } else {
    // counts comments for specific article in comment table
    countComments(article_id)
      .then((commentCount) => {
        // uses comment count to update the article and add a comment property
        updateArticles(article_id, commentCount);
      })
      .then(() => {
        selectArticle(article_id).then((output) => {
          if (output === undefined) {
            res.status(404).send({ msg: "article doesn't exist" });
          } else {
            res.status(200).send({ article: output });
          }
        });
      });
  }
};

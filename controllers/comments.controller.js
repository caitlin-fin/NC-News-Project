const { selectComments } = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    selectComments(article_id).then((comments) => {
      res.status(200).send({ comments });
    });
  }
};

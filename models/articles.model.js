const db = require("../db/connection");

exports.selectArticle = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count FROM articles 
      LEFT JOIN comments ON (articles.article_id=comments.article_id)
      WHERE articles.article_id=$1 GROUP BY articles.article_id`, [id]
    )
    .then((article) => {
      return article.rows[0];
    });
};

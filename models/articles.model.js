const db = require("../db/connection");

exports.updateArticles = (id, commentCount) => {
  // add a comment count comumn to article data
  return db
    .query(`ALTER TABLE articles ADD comment_count INT DEFAULT 0`)
    .then(() => {
      return db.query(
        `UPDATE articles SET comment_count = $1 WHERE article_id = $2;`,
        [commentCount, id]
      );
    });
};

exports.selectArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((article) => {
      return article.rows[0];
    });
};

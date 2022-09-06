const db = require("../db/connection");

exports.selectArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((article) => {
      return article.rows[0];
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(`SELECT votes FROM articles WHERE article_id = 1`)
    .then((articleVotes) => {
      let { votes } = articleVotes.rows[0];
      votes += inc_votes;
      return votes;
    })
    .then((votes) => {
      return db.query(
        `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,
        [votes, article_id])
        .then((updatedArticle) => {
          return updatedArticle.rows[0]
        })
    });
};


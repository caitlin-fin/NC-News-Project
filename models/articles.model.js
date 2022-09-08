const db = require("../db/connection");

exports.selectArticle = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count FROM articles 
      LEFT JOIN comments ON (articles.article_id=comments.article_id)
      WHERE articles.article_id=$1 GROUP BY articles.article_id`,
      [id]
    )
    .then((article) => {
      return article.rows[0];
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(`SELECT votes FROM articles WHERE article_id = ${article_id};`)
    .then((articleVotes) => {
      if (articleVotes.rows.length === 0) {
        console.log('error!')
        return Promise.reject({ status: 404, msg: "article doesn't exist" });
      } else {
        let { votes } = articleVotes.rows[0];
        votes += inc_votes;
        return votes;
      }
    })
    .then((votes) => {
      return db
        .query(
          `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,
          [votes, article_id]
        )
        .then((updatedArticle) => {
          return updatedArticle.rows[0];
        });
    });
};

// if (result.rows.length === 0) {
// return Promise.reject({ status: 404, msg: "bad request" });

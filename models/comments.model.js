const db = require("../db/connection");

exports.countComments = (id) => {
  let commentCount = 0;
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then((data) => {
      commentCount += data.rows.length;
      return commentCount;
    });
};

const db = require("../db/connection");

exports.selectComments = (id) => {
  return db.query(`SELECT * FROM comments WHERE article_id = $1`, [id]).then((comments) => {
    return comments.rows
  })
};

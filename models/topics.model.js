const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
};

exports.checkTopicsExist = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug=$1`, [topic])
    .then((topicData) => {
      if (topicData.rows.length === 0) {
        return false;
      } else {
        return true;
      }
    });
};

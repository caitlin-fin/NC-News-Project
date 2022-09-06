const { selectUsers } = require("../models/users.model");

exports.getUsers = (req, res) => {
  selectUsers().then((output) => {
    res.status(200).send({ users: output });
  });
};

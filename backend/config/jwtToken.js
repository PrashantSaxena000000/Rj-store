const jwt = require("jsonwebtoken");

const genrateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1d" });
};

module.exports = {genrateToken};

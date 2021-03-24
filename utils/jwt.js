const jwt = require("jsonwebtoken");
const config = require("./../config/config");

module.exports = {
  signToken: signToken,
  verifyToken: verifyToken,
};

function signToken(_id) {
  return new Promise((resolve, reject) => {
    jwt.sign(_id, config.jwtKey, {algorithm: config.algorithm}, function(error, token) {
      if(error) return reject(error);
      return resolve(token);
    })
  })
}

function verifyToken(token) {

  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtKey, {algorithms: config.algorithm}, function(error, decoded){
      if(error) return reject(error);
      return resolve(decoded);
    })
  });
}

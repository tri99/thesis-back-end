const config = require("./config/config");
const jwt = require("jsonwebtoken");
function verifyTypeDevice(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      config.jwtTypeKey,
      { algorithm: config.algorithm },
      (error, decoded) => {
        if (error) return reject(error);
        return resolve(decoded);
      }
    );
  });
}
let a =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiYXVkaW8ifQ.V5aPaZvrMNQZLv3E7sw7yGId8I6SeMjmBDsFjYK21BFCNYeHED48_hQWi6VWyLX8zNvtD8lLSLD4n0Ug1QQIZg";
verifyTypeDevice(a).then((data) => {
  console.log(data);
});

const jwtService = require("./../utils/jwt");
const config = require("./../config");
async function isAuthen(req, res, next) {
  try {
    const token = req.query.token || req.body.token || req.headers.token;
    if (!token)
      return res
        .status(config.status_code.TOKEN_ERROR)
        .send({ message: config.status_message.TOKEN_NOT_FOUND });
    const decodeToken = jwtService.verifyToken(token);
    if (!decodeToken)
      return res
        .status(config.status_code.TOKEN_ERROR)
        .send({ message: config.status_message.TOKEN_NOT_FOUND });
    req.userId = decodeToken.id;
    next();
  } catch (error) {
    return res.status(config.status_code.WRONG).send({ message: error });
  }
}

module.exports = {
  isAuthen: isAuthen,
};

const jwtService = require("./../utils/jwt");
const config = require("./../config/config");
async function isAuthen(req, res, next) {
  try {
    let [bearer, token] = req.headers.authorization.split(" ");
    if (bearer != "Bearer") {
      return res
        .status(config.status_code.TOKEN_ERROR)
        .send({ message: "TOKEN ERROR" });
    }
    if (!token)
      return res
        .status(config.status_code.TOKEN_ERROR)
        .send({ message: config.status_message.TOKEN_NOT_FOUND });
    const decodeToken = await jwtService.verifyToken(token);
    if (!decodeToken)
      return res
        .status(config.status_code.TOKEN_ERROR)
        .send({ message: config.status_message.TOKEN_NOT_FOUND });
    req.userId = decodeToken.id;
    req.subuserId = decodeToken.subuserId;
    next();
  } catch (error) {
    return res.status(config.status_code.WRONG).send({ message: error });
  }
}

async function deviceAuthen(req, res, next) {
  try {
    let token = req.headers.token || req.body.token;
    if (!token)
      return res
        .status(config.status_code.TOKEN_ERROR)
        .send({ message: config.status_message.TOKEN_NOT_FOUND });
    const decodeToken = await jwtService.verifyDevice(token);
    if (!decodeToken)
      return res
        .status(config.status_code.TOKEN_ERROR)
        .send({ message: config.status_message.TOKEN_NOT_FOUND });
    req.deviceId = decodeToken.id;
    next();
  } catch (error) {
    return res.status(config.status_code.WRONG).send({ message: error });
  }
}

module.exports = {
  isAuthen: isAuthen,
  deviceAuthen,
};

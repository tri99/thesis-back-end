const router = require("express").Router();
const reportVideoLog = require("./../controllers/reportVideoLog");
const auth = require("./../middlewares/authen_token");

module.exports = () => {
  router.get("/user/", auth.isAuthen, reportVideoLog.getByUserId);
  router.get(
    "/period/:timeS/:timeE",
    auth.isAuthen,
    reportVideoLog.getByPeriod
  );
  router.get("/adOffer", auth.isAuthen, reportVideoLog.getByAdOffer);
  router.delete("/:id", auth.isAuthen, reportVideoLog.deleteByUserId);
  return router;
};

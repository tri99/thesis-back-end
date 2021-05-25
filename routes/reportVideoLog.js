const router = require("express").Router();
const reportVideoLog = require("./../controllers/reportVideoLog");
const auth = require("./../middlewares/authen_token");
const upload = require("./../utils/uploadFile");
module.exports = () => {
  router.post(
    "/deivce/infor-ai",
    auth.deviceAuthen,
    upload.catchErrorImage(),
    reportVideoLog.insert
  );
  router.get("/user/", auth.isAuthen, reportVideoLog.getByUserId);
  router.get(
    "/period/:timeS/:timeE",
    auth.isAuthen,
    reportVideoLog.getByPeriod
  );
  router.get("/adOffer", auth.isAuthen, reportVideoLog.getByAdOffer);
  router.get("/bdManager", auth.isAuthen, reportVideoLog.getByBdManager);
  router.get("/age", auth.isAuthen, reportVideoLog.getByAge);
  router.get("/gender", auth.isAuthen, reportVideoLog.getByGender);
  router.get("/overview", auth.isAuthen, reportVideoLog.getOverview);
  router.delete("/:id", auth.isAuthen, reportVideoLog.deleteByUserId);
  router.get("/", auth.isAuthen, reportVideoLog.getAllByPeriod);
  return router;
};

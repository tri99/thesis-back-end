const router = require("express").Router();
const bdAnalytics = require("./../controllers/bdAnalytics");
const auth = require("./../middlewares/authen_token");

module.exports = () => {
  router.get("/zone", auth.isAuthen, bdAnalytics.getByZone);
  router.get("/ad-manager", auth.isAuthen, bdAnalytics.getByAdManager);
  router.get("/age", auth.isAuthen, bdAnalytics.getByAge);
  router.get("/gender", auth.isAuthen, bdAnalytics.getByGender);
  return router;
};

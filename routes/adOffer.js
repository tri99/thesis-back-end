const router = require("express").Router();
const adOfferController = require("./../controllers/adOffer");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  router.post("/", auth.isAuthen, adOfferController.insert);
  router.post(
    "/checkBudget/",
    auth.deviceAuthen,
    adOfferController.checkBudgetToRun
  );
  router.get("/", auth.isAuthen, adOfferController.getAll);
  router.get("/full-infor/:id", auth.isAuthen, adOfferController.getFullInfor);
  router.get("/ad-manager/", auth.isAuthen, adOfferController.getByAdManagerId);
  router.get("/bd-manager/", auth.isAuthen, adOfferController.getByBdManagerId);
  router.get("/statuses/", auth.isAuthen, adOfferController.getByArrayStatus);
  router.get("/belong-to", auth.isAuthen, adOfferController.getBelongToAds);
  router.get("/:id", auth.isAuthen, adOfferController.getById);
  router.delete("/:id", auth.isAuthen, adOfferController.deleteById);
  router.put(
    "/adset/:id",
    auth.isAuthen,
    adOfferController.updateAdsetOFAdOffer
  );
  router.put("/status/:id", auth.isAuthen, adOfferController.updateStatusById);
  router.put("/:id/cancel", auth.isAuthen, adOfferController.cancelOffer);
  router.put("/:id/send", auth.isAuthen, adOfferController.sendOffer);
  router.put("/:id/redeploy", auth.isAuthen, adOfferController.redeployOffer);
  router.put("/:id/deploy", auth.isAuthen, adOfferController.deployOffer);
  router.put("/:id/reject", auth.isAuthen, adOfferController.rejectOffer);
  router.put("/:id", auth.isAuthen, adOfferController.updateById);

  return router;
};

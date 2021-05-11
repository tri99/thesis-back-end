const router = require("express").Router();
const adOfferController = require("./../controllers/adOffer");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  router.post("/", auth.isAuthen, adOfferController.insert);
  router.get("/", auth.isAuthen, adOfferController.getAll);
  router.get("/fullInfor/:id", auth.isAuthen, adOfferController.getFullInfor);
  router.get("/adManager/", auth.isAuthen, adOfferController.getByAdManagerId);
  router.get("/bdManager/", auth.isAuthen, adOfferController.getByBdManagerId);
  router.get("/statuses/", auth.isAuthen, adOfferController.getByArrayStatus);
  router.get("/:id", auth.isAuthen, adOfferController.getById);
  router.delete("/:id", auth.isAuthen, adOfferController.deleteById);
  router.put(
    "/adset/:id",
    auth.isAuthen,
    adOfferController.updateAdsetOFAdOffer
  );
  router.put("/status/:id", auth.isAuthen, adOfferController.updateStatusById);
  router.put(
    "/status-cancel/:id",
    auth.isAuthen,
    adOfferController.CancelOfferById
  );
  router.put("/:id", auth.isAuthen, adOfferController.updateById);

  return router;
};

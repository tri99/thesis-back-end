const router = require("express").Router();
const adOfferController = require("./../controllers/adOffer");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  router.post("/", auth.isAuthen, adOfferController.insert);
  router.get("/", auth.isAuthen, adOfferController.getAll);
  router.get("/adManager/:id", auth.isAuthen, adOfferController.getById);
  router.get("/bdManager/:id", auth.isAuthen, adOfferController.getById);
  router.get("/:id", auth.isAuthen, adOfferController.getById);
  router.delete("/:id", auth.isAuthen, adOfferController.deleteById);
  router.put("/:id", auth.isAuthen, adOfferController.updateById);

  return router;
};

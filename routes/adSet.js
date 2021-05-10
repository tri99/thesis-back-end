const router = require("express").Router();
const adSetController = require("./../controllers/adSet");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  router.post("/", auth.isAuthen, adSetController.insert);
  router.get("/", auth.isAuthen, adSetController.getAll);
  router.get("/adManager/:id", auth.isAuthen, adSetController.getById);
  router.get("/:id", auth.isAuthen, adSetController.getById);
  router.delete("/:id", auth.isAuthen, adSetController.deleteById);
  router.put("/:id", auth.isAuthen, adSetController.updateById);

  return router;
};

const router = require("express").Router();
const permGroupController = require("./../controllers/permissionGroup");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  /**
   *  @param {String} name
   */
  router.post("/", auth.isAuthen, permGroupController.insert);
  router.get("/", auth.isAuthen, permGroupController.getAll);
  router.get("/:id", auth.isAuthen, permGroupController.getById);
  router.delete("/:id", auth.isAuthen, permGroupController.deleteById);
  router.put("/:id", auth.isAuthen, permGroupController.updateById);

  return router;
};

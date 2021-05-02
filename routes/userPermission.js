const router = require("express").Router();
const userPermController = require("./../controllers/userPermission");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  /**
   *  @param {String} name
   */
  router.post("/", auth.isAuthen, userPermController.insert);
  //   router.get("/", auth.isAuthen, userPermController.getAll);
  //   router.get("/:id", auth.isAuthen, userPermController.getById);
  //   router.delete("/:id", auth.isAuthen, userPermController.deleteById);
  //   router.put("/:id", auth.isAuthen, userPermController.updateById);
  router.get("/subusers/:id", auth.isAuthen, userPermController.getBySubuserId);
  return router;
};

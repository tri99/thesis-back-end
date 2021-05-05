const router = require("express").Router();
const userPermController = require("./../controllers/userPermission");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  /**
   *  @param {String} name
   */
  router.post("/", auth.isAuthen, userPermController.insert);
  router.post("/insert-many", auth.isAuthen, userPermController.insertMany);
  //   router.get("/", auth.isAuthen, userPermController.getAll);
  //   router.get("/:id", auth.isAuthen, userPermController.getById);
  //   router.delete("/:id", auth.isAuthen, userPermController.deleteById);
  router.post(
    "/delete-many-by-perm-groups",
    auth.isAuthen,
    userPermController.deleteManyByPermGroups
  );
  router.post("/delete-zone", auth.isAuthen, userPermController.deleteByZone);
  //   router.put("/:id", auth.isAuthen, userPermController.updateById);
  router.get("/subusers/:id", auth.isAuthen, userPermController.getBySubuserId);
  router.get("/zones/:id", auth.isAuthen, userPermController.getByZoneId);
  router.get(
    "/perm-groups/:id",
    auth.isAuthen,
    userPermController.getByPermissionGroupId
  );
  return router;
};

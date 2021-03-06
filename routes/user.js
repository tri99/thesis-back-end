// var config = require("./../config/config");
// const io = require("socket.io")
const UserController = require("./../controllers/user");
const SubuserController = require("./../controllers/subuser");
const auth = require("./../middlewares/authen_token");
const router = require("express").Router();

module.exports = () => {
  router.post("/sign-in", UserController.signIn);
  router.post("/sign-up", UserController.signUp);
  //   router.post("/users/forget-password", UserController.forgetPassword);
  //   router.post("/current-user/", UserController.)
  router.get("/current-user", auth.isAuthen, UserController.getCurrentUser);
  router.get("/type-user", auth.isAuthen, UserController.getUserByTypeUser);
  //   router.get("/", UserController.getAllUser);
  router.get("/listid", UserController.getUserByListId);
  router.get("/email", UserController.getUserByEmail);
  router.put("/notifications", auth.isAuthen, UserController.readNotifications);
  router.put("/update", auth.isAuthen, UserController.updateUserById);
  router.post("/subusers", auth.isAuthen, UserController.signUp);
  router.delete("/subusers/:id", auth.isAuthen, SubuserController.deleteById);
  // router.get("/subusers/:id", auth.isAuthen, UserController);
  router.get("/subusers", auth.isAuthen, SubuserController.getAll);
  router.get(
    "/bd-managers/:id/zone-info",
    auth.isAuthen,
    UserController.getBdManagerZoneInfo
  );
  router.get("/notifications", auth.isAuthen, UserController.getNotifications);
  router.post("/notifications", auth.isAuthen, UserController.testNotification);
  return router;
};

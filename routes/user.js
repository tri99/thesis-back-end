var config = require("./../config/config");
// const io = require("socket.io")
const UserController = require("./../controllers/user");

const router = require("express").Router();

module.exports = () => {
  router.post("/sign-in", UserController.signIn);
  router.post("/sign-up", UserController.signUp);
//   router.post("/users/forget-password", UserController.forgetPassword);
//   router.post("/current-user/", UserController.)
  router.get("/:id", UserController.getUserById);
//   router.get("/", UserController.getAllUser);
  router.get("/listid", UserController.getUserByListId);
  router.get("/email", UserController.getUserByEmail);
  router.put("/:id", UserController.updateUserById);
  return router;
};

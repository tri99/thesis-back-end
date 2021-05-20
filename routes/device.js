const router = require("express").Router();
const deviceController = require("./../controllers/device");
const auth = require("./../middlewares/authen_token");

module.exports = () => {
  router.post("/", auth.isAuthen, deviceController.addDevice);
  router.post("/insert-new", deviceController.insert);
  router.post("/config-device", deviceController.getConfig);
  router.get("/", auth.isAuthen, deviceController.getDevicesByUserId);
  router.get("/:id", auth.isAuthen, deviceController.getById);
  router.delete("/:id", auth.isAuthen, deviceController.deleteDevice);
  router.put("/:id", auth.isAuthen, deviceController.updateDevice);
  router.put("/zone/:id", auth.isAuthen, deviceController.updateZoneDevice);

  return router;
};

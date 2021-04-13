const router = require("express").Router();
const deviceController = require("./../controllers/device");

module.exports = () => {
  router.post("/", deviceController.insert);
  router.post("/config-device", deviceController.getConfig);
  router.get("/:id", deviceController.getById);
  router.get("/get-all", deviceController.getAll);
  router.delete("/:id", deviceController.deleteDevice);
  router.put("/:id", deviceController.updateDevice);
  router.put("/zone/:id", deviceController.updateZoneDevice);

  return router;
};

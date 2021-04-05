const router = require("express").Router();
const deviceService = require("./../controllers/device");

module.exports = () => {
  router.post("/add-device", deviceService.insert);
  router.get("/get-device-by-id", deviceService.getById);
  router.get("/get-all-devices", deviceService.getAll);
  router.delete("/delete-device", deviceService.deleteById);
  router.put("/update-device", deviceService.updateById);
  return router;
};

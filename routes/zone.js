const router = require("express").Router();
const zoneController = require("./../controllers/zone");

module.exports = () => {
  /**
   *  @param {String} name
   */
  router.post("/", zoneController.insert);
  // api for device, dont touch
  router.post("/get-zone-for-device", zoneController.getByIdforDevice);
  router.post("/get-zone-for-device-2", zoneController.getZoneByDeviceId);
  /**
   *  @param {String} _id
   */
  router.get("/:id", zoneController.getById);
  router.get("/", zoneController.getAll);
  /**
   *  @param {String} name
   */
  router.delete("/:id", zoneController.deleteById);
  /**
   *
   *@param {String} _id
   *@param {String} name
   *@param  {Array}  videoArray[{_id:stirng, path: String, duration: Number, size: Number}], playlistArray["String"], deviceArray["String"]
   */
  router.put("/:id", zoneController.updateById);

  /**
   * @param {String} zoneId
   * @param {String} deviceId
   */
  router.post("/add-device/", zoneController.addDeviceToZone);

  /**
   * @param {String} zoneId
   * @param {String} deviceId
   */
  router.post("/remove-device/", zoneController.removeDeviceFromZone);
  return router;
};

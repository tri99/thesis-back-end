const router = require("express").Router();
const zoneController = require("./../controllers/zone");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  /**
   *  @param {String} name
   */
  router.post("/", auth.isAuthen, zoneController.insert);
  // api for device, dont touch
  router.post("/get-zone-for-device", zoneController.getByIdforDevice);
  router.post("/get-zone-for-device-2", zoneController.getZoneByDeviceId);

  router.get("/", auth.isAuthen, zoneController.getZoneByUserId);

  // router.post("/test", zoneController.getZoneByvideoArrayId)
  /**
   *  @param {String} _id
   */
  router.get("/:id", auth.isAuthen, zoneController.getById);
  // router.get("/", auth.isAuthen,zoneController.getAll);
  /**
   *  @param {String} name
   */
  router.delete("/:id", auth.isAuthen, zoneController.deleteById);
  /**
   *
   *@param {String} _id
   *@param {String} name
   *@param  {Array}  videoArray[{_id:stirng, path: String, duration: Number, size: Number}], playlistArray["String"], deviceArray["String"]
   */
  router.put("/:id", auth.isAuthen, zoneController.updateById);

  /**
   * @param {String} zoneId
   * @param {String} deviceId
   */
  router.post("/add-device/", auth.isAuthen, zoneController.addDeviceToZone);

  /**
   * @param {String} zoneId
   * @param {String} deviceId
   */
  router.post(
    "/remove-device/",
    auth.isAuthen,
    zoneController.removeDeviceFromZone
  );

  return router;
};

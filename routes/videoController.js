const videoController = require("./../controllers/videoController");
const router = require("express").Router();

module.exports = () => {
  // router.post("/insert-video", videoController.insert);
  /**
   * @param {String}zoneId,
   * @param {String}videoId,
   * @param {ArrayString}deviceArray
   */
  router.post("/play-video", videoController.playVideo);
  /**
   * @param {String}zoneId,
   * @param {ArrayString}deviceArray
   */
  router.post("/pause-video", videoController.pauseVideo);
  /**
   * @param {String}zoneId,
   * @param {Number} volume
   * @param {ArrayString}deviceArray
   */
  router.post("/volume-video", videoController.volumeVideo);

  /**
   * @param {String}zoneId,
   */
  router.post("/get-infor-video", videoController.getInforVideo);
  router.post("/device", videoController.controlDevice);
  router.post("/", videoController.control);

  return router;
};

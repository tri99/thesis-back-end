const videoController = require("./../controllers/videoController");
const router = require("express").Router();
const fileUpload = require("./../utils/uploadFile");

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
  return router;
};

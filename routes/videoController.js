const videoController = require("./../controllers/videoController");
const router = require("express").Router();
const fileUpload = require("./../utils/uploadFile");

module.exports = () => {
  // router.post("/insert-video", videoController.insert);
  router.post("/play-video", videoController.playVideo);
  router.post("/pause-video", videoController.pauseVideo);
  return router;
};

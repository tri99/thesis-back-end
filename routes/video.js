const videoController = require("./../controllers/video");
const router = require("express").Router();
const fileUpload = require("./../utils/uploadFile");
const auth = require("./../middlewares/authen_token");
module.exports = () => {
  // router.post("/insert-video", videoController.insert);
  /**
   * @form_data
   * @param {file} video
   * @param {Number} duration
   * @param {ArrayString} tags
   */
  router.post(
    "/",
    auth.isAuthen,
    fileUpload.catchErrorVideo(),
    videoController.upload
  );
  router.get("/", auth.isAuthen, videoController.getVideosByUserId);
  /**
   * @param {ArrayString} videoIds
   */
  router.get("/get-many", auth.isAuthen, videoController.getManyByArrayId);
  /**
   * @param {String} _id
   */
  router.delete("/:id", auth.isAuthen, videoController.deleteById);
  return router;
};

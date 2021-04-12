const videoController = require("./../controllers/video");
const router = require("express").Router();
const fileUpload = require("./../utils/uploadFile")

module.exports = () => {
  // router.post("/insert-video", videoController.insert);
  /**
   * @form_data
   * @param {file} video
   * @param {Number} duration
   * @param {ArrayString} tags
   */
  router.post(
    "/upload-video",
    fileUpload.catchErrorVideo(),
    videoController.upload
  );
  router.get("/", videoController.getAll);
  /**
   * @param {ArrayString} videoIds
   */
  router.get("/get-many", videoController.getManyByArrayId);
  /**
   * @param {String} _id
   */
  router.delete("/:id", videoController.deleteById);
  return router;
}
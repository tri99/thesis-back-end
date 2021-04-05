const videoController = require("./../controllers/video");
const router = require("express").Router();
const fileUpload = require("./../utils/uploadFile")

module.exports = () => {
    // router.post("/insert-video", videoController.insert);
    router.post("/upload-video",fileUpload.catchErrorVideo(), videoController.upload)
    router.get("/get-many-by-ids", videoController.getManyByArrayId);
    router.delete("/delete-by-id", videoController.deleteById);
    router.post("/play-video", videoController.playVideo);
    router.post("/pause-video", videoController.pauseVideo);
    return router
}
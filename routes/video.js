const videoController = require("./../controllers/video");
const router = require("express").Router();

module.exports = () => {
    router.post("/video/insert", videoController.insert);
    router.get("/get-many-by-ids", videoController.getManyByArrayId);
    router.delete("/delete-by-id", videoController.deleteById);
}
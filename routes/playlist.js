const router = require("express").Router();
const playlistController = require("./../controllers/playlist");

module.exports = () => {
    router.post("/creat-playlist", playlistController.insert);
    router.get(
      "/get-many-play-list-by-ids",
      playlistController.getManyByArrayId
    );
    router.get("/get-all-playlist", playlistController.getAll);
    router.put("update-playlist", playlistController.updateById);
    router.delete("/delete-playlist", playlistController.deleteById)
}
const router = require("express").Router();
const playlistController = require("./../controllers/playlist");

module.exports = () => {
  /**
   * @param {String} name
   * @param {String} type
   * @param {ArrayString} mediaArray
   */
  router.post("/", playlistController.insert);
  router.get("/get-many", playlistController.getManyByArrayId);
  router.get("/", playlistController.getAll);
  /**
   * @param {String} _id
   */
  router.put("/:id", playlistController.updateById);
  /**
   * @param {String} _id
   * @param {String} name
   * @param {String} type
   * @param {ArrayString} mediaArray
   */
  router.delete("/:id", playlistController.deleteById);
}
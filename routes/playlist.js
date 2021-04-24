const router = require("express").Router();
const playlistController = require("./../controllers/playlist");
const auth = require("./../middlewares/authen_token")
module.exports = () => {
  /**
   * @param {String} name
   * @param {String} type
   * @param {ArrayString} mediaArray
   */
  router.post("/",auth.isAuthen, playlistController.insert);
  router.get("/get-many", auth.isAuthen, playlistController.getManyByArrayId);
  router.get("/", auth.isAuthen, playlistController.getPlaylistByUserId);
  /**
   * @param {String} _id
   */
  router.put("/:id", auth.isAuthen, playlistController.updateById);
  /**
   * @param {String} _id
   * @param {String} name
   * @param {String} type
   * @param {ArrayString} mediaArray
   */
  router.delete("/:id", auth.isAuthen, playlistController.deleteById);
  return router;
}
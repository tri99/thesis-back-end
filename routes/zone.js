
const router = require("express").Router();
const zoneController = require("./../controllers/zone");

module.exports = () => {
    router.post("/create-zone", zoneController.insert);
    router.get("/:id", zoneController.getById);
    router.get("/", zoneController.getAll);
    router.delete("/:id", zoneController.deleteById);
    router.put("/:id", zoneController.updateById);
    return router;
}
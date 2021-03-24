
const router = require("express").Router();
const zoneController = require("./../controllers/zone");

module.exports = () => {
    router.post("create-zone", zoneController.insert);
    router.get("/get-zone-by-id", zoneController.getById);
    router.delete("/delete-zone", zoneController.deleteById);
    router.put("/update-zone", zoneController.updateById);
    return router;
}
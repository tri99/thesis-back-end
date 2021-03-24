const deviceService = require("./../services/device");
const config = require("./../config/config");

async function insert(req, res){
    try {
        const { name, serialNumber, zoneId } = req.body;
        const deviceDocument = deviceService.createModel(
          name,
          serialNumber,
          zoneId
        );
        await deviceService.insert(deviceDocument);
        return res.status(config.status_code.OK).send({device: deviceDocument});
    } catch (error) {
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
    }
}

async function deleteDevice(req, res){
    try {
        const {deviceId} = req.body;
        await deviceService.deleteDevice(deviceId);
        return res.status(config.status_code.OK).send({ device: OK });
    } catch (error) {
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
    }
}

async function updateZoneDevice(req, res){
    try {
        const {deviceId, zoneId} = req.body;
        await deviceService.updateZoneDevice(deviceId, zoneId);
        return res.status(config.status_code.OK).send({deviceId: true});
    } catch (error) {
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
    }
}

async function getAll(req, res){
    try {
        const deviceDocument = await deviceDocument.getAll();
        return res.status(config.status_code.OK).send({ deviceId: deviceDocument });
    } catch (error) {
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
    }
}

module.exports = {
  insert: insert,
  updateZoneDevice: updateZoneDevice,
  deleteDevice: deviceService,
  getAll: getAll,
};
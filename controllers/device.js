const deviceService = require("./../services/device");
const jwt = require("./../utils/jwt");
const config = require("./../config/config");

async function insert(req, res) {
  try {
    const { name, serialNumber, zoneId } = req.body;

    let deviceDocumentCheck = await deviceService.getByOneParam(serialNumber);
    if (deviceDocumentCheck)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: config.status_message.DEVICE_EXIST });

    const deviceDocument = deviceService.createModel(
      name,
      serialNumber,
      zoneId
    );
    await deviceService.insert(deviceDocument);
    return res.status(config.status_code.OK).send({ device: deviceDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteDevice(req, res) {
  try {
    const { deviceId } = req.body;
    await deviceService.deleteDevice(deviceId);
    return res.status(config.status_code.OK).send({ device: OK });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateZoneDevice(req, res) {
  try {
    const { deviceId, zoneId } = req.body;
    await deviceService.updateZoneDevice(deviceId, zoneId);
    return res.status(config.status_code.OK).send({ deviceId: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateDevice(req, res) {
  try {
    const { deviceId, name, zoneId } = req.body;
    await deviceService.updateDevice(deviceId, name, zoneId);
    return res.status(config.status_code.OK).send({ deviceId: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const deviceDocument = await deviceDocument.getAll();
    return res.status(config.status_code.OK).send({ deviceId: deviceDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const { deviceId } = req.body;
    const deviceDocument = await deviceDocument.getById(deviceId);
    return res.status(config.status_code.OK).send({ deviceId: deviceDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getConfig(req, res) {
  try {
    const { token, serial_number } = req.body;
    if (!token || !serial_number)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: config.status_message.NOT_PERMISSION });
    const deviceDocument = await deviceService.getBySerialNumber(serial_number);
    if (!deviceDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: config.status_message.NOT_PERMISSION });

    const tokenDevice = await jwt.signDevice({id: deviceDocument["_id"]});
    return res.status(config.status_code.OK).send({
      token: tokenDevice,
    });
  } catch (error) {
    return res
      .status(config.status_code.SERVER_ERROR)
      .send({ message: "NOT_PERMISSION" });
  }
}

module.exports = {
  insert: insert,
  updateZoneDevice: updateZoneDevice,
  updateDevice: updateDevice,
  deleteDevice: deleteDevice,
  getAll: getAll,
  getById: getById,
  getConfig: getConfig,
};

const deviceService = require("./../services/device");
const jwt = require("./../utils/jwt");
const config = require("./../config/config");

async function insert(req, res) {
  try {
    const { name, serialNumber } = req.body;

    let deviceDocumentCheck = await deviceService.getBySerialNumber(
      serialNumber
    );
    if (deviceDocumentCheck)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: config.status_message.DEVICE_EXIST });

    const deviceDocument = deviceService.createModel(
      name,
      serialNumber,
      null,
      null
    );
    await deviceService.insert(deviceDocument);
    return res.status(config.status_code.OK).send({ device: deviceDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function addDevice(req, res) {
  try {
    const { name, serialNumber } = req.body;

    let deviceDocumentCheck = await deviceService.getBySerialNumber(
      serialNumber
    );
    if (!deviceDocumentCheck) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "DEVICE_NOT_EXIST" });
    }
    deviceDocumentCheck["name"] = name;
    deviceDocumentCheck["serialNumber"] = serialNumber;
    deviceDocumentCheck["zoneId"] = null;
    deviceDocumentCheck["userId"] = req.userId;
    await deviceService.insert(deviceDocumentCheck);
    return res
      .status(config.status_code.OK)
      .send({ device: deviceDocumentCheck });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteDevice(req, res) {
  try {
    const deviceId = req.params.id;
    await deviceService.deleteDevice(deviceId);
    return res.status(config.status_code.OK).send({ device: true });
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
    const deviceId = req.params.id;
    const { name, zoneId } = req.body;
    await deviceService.updateDevice(deviceId, name, zoneId);
    return res.status(config.status_code.OK).send({ deviceId: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const deviceDocument = await deviceService.getAll();
    return res.status(config.status_code.OK).send({ devices: deviceDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const deviceId = req.params.id;
    const deviceDocument = await deviceService.getById(deviceId);
    return res.status(config.status_code.OK).send({ device: deviceDocument });
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

    const tokenDevice = await jwt.signDevice({ id: deviceDocument["_id"] });
    return res.status(config.status_code.OK).send({
      token: tokenDevice,
    });
  } catch (error) {
    return res
      .status(config.status_code.SERVER_ERROR)
      .send({ message: "NOT_PERMISSION" });
  }
}

async function getDevicesByUserId(req, res) {
  try {
    const userId = req.userId;
    // console.log(videoIds);
    let deviceDocument = await deviceService.findBy(
      { userId },
      { populate: { path: "zoneId", select: "_id name" } }
    );
    // console.log(videoDocument);
    return res.status(config.status_code.OK).send({ devices: deviceDocument });
  } catch (error) {
    // console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
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
  getDevicesByUserId: getDevicesByUserId,
  addDevice: addDevice,
};

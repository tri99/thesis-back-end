const Device = require("./../collections/device");
const basicCRUDGenerator = require("./basicCRUD");
const deviceCRUD = basicCRUDGenerator(Device);

function createModel(name, serialNumber, zoneId, userId) {
  const deviceDocument = new Device({
    name: name,
    serialNumber: serialNumber,
    zoneId: zoneId,
    status: false,
    userId: userId,
    timeStatusChange: new Date(),
  });
  return deviceDocument;
}

function insert(deviceDocument) {
  return new Promise((resolve, reject) => {
    deviceDocument.save((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function deleteDevice(deviceId) {
  return new Promise((resolve, reject) => {
    Device.deleteOne({ _id: deviceId }).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function updateZoneDevice(deviceId, zoneId) {
  return new Promise((resolve, reject) => {
    Device.update({ _id: deviceId }, { zoneId: zoneId }).exec((error) => {
      if (error) return reject(error);
      return resolve(error);
    });
  });
}

function updateDevice(deviceId, name) {
  return new Promise((resolve, reject) => {
    Device.update({ _id: deviceId }, { name: name }).exec((error) => {
      if (error) return reject(error);
      return resolve(error);
    });
  });
}

function updateStatusDevice(deviceId, status) {
  return new Promise((resolve, reject) => {
    Device.update(
      { _id: deviceId },
      { status: status, timeStatusChange: new Date() }
    ).exec((error) => {
      if (error) return reject(error);
      return resolve(error);
    });
  });
}

function getAll() {
  return new Promise((resolve, reject) => {
    Device.find().exec((error, deviceDocument) => {
      if (error) return reject(error);
      return resolve(deviceDocument);
    });
  });
}

function getById(deviceId) {
  return new Promise((resolve, reject) => {
    Device.findById(deviceId).exec((error, deviceDocument) => {
      if (error) return reject(error);
      return resolve(deviceDocument);
    });
  });
}

function getBySerialNumber(key) {
  return new Promise((resolve, reject) => {
    Device.findOne({ serialNumber: key })
      .select("_id")
      .exec((error, deviceDocument) => {
        if (error) return reject(error);
        return resolve(deviceDocument);
      });
  });
}

function getManyByArrayId(deviceIds) {
  return new Promise((resolve, reject) => {
    Device.find({ _id: deviceIds })
      .select("_id name")
      .exec((error, deviceDocument) => {
        if (error) return reject(error);
        return resolve(deviceDocument);
      });
  });
}

function getManyByUserId(userId) {
  return new Promise((resolve, reject) => {
    Device.find({ userId: userId })
      .select()
      .exec((error, deviceDocument) => {
        if (error) return reject(error);
        return resolve(deviceDocument);
      });
  });
}

module.exports = {
  ...deviceCRUD,
  createModel: createModel,
  insert: insert,
  deleteDevice: deleteDevice,
  updateZoneDevice: updateZoneDevice,
  updateDevice: updateDevice,
  getAll: getAll,
  getById: getById,
  getBySerialNumber: getBySerialNumber,
  getManyByArrayId: getManyByArrayId,
  updateStatusDevice: updateStatusDevice,
  getManyByUserId: getManyByUserId,
};

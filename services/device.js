const Device = require("./../collections/device");

function createModel(name, serialNumber, zoneId){
    const deviceDocument = new Device({
      name: name,
      serialNumber: serialNumber,
      zoneId: zoneId,
    });
    return deviceDocument;
}

function insert(deviceDocument){
    return new Promise((resolve, reject) => {
        deviceDocument.save((error) => {
            if(error) return reject(error);
            return resolve(true);
        })
    })
}

function deleteDevice(deviceId){
    return new Promise((resolve, reject) => {
        Device.deleteOne({_id: deviceId}).exec(error => {
            if(error) return reject(error);
            return resolve(true);
        })
    })
}

function updateZoneDevice(deviceId, zoneId){
    return new Promise((resolve, reject) => {
        Device.update({ _id: deviceId }, { zoneId: zoneId }).exec((error) => {
          if (error) return reject(error);
          return resolve(error);
        });
    })
}

function getAll(){
    return new Promise((resolve, reject) => {
        Device.find().exec((error, deviceDocument) => {
            if(error) return reject(error);
            return resolve(deviceDocument);
        })
    })
}

function getById(deviceId) {
  return new Promise((resolve, reject) => {
    Device.findById(deviceId).exec((error, deviceDocument) => {
        if(error) return reject(error);
        return resolve(deviceDocument);
    });
  });
}

module.exports = {
  createModel: createModel,
  insert: insert,
  deleteDevice: deleteDevice,
  updateZoneDevice: updateZoneDevice,
  getAll: getAll,
  getById: getById,
};
const config = require("./../config/config");
const zoneService = require("./../services/zone");
const deviceService = require("./../services/device");
const playlistService = require("./../services/playlist");
/**
 *  @param {String} name
 */

async function insert(req, res) {
  try {
    const { name } = req.body;
    const videoArray = [];
    const playlistArray = [];
    const deviceArray = [];
    const videoVolume = 0;
    const newZoneDocument = zoneService.createModel(
      videoArray,
      playlistArray,
      deviceArray,
      name,
      videoVolume
    );
    console.log(newZoneDocument);
    await zoneService.insert(newZoneDocument);
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

/**
 *
 *@param {String} _id, name
 *@param {Array}  videoArray[{_id:string, path: String, duration: Number, size: Number}]
 *@param {Array}  playlistArray[{_id:String, name:"String",mediaArray:{ArrayString}, Type: String]
 *@param {Array} deviceArray[_id:"String"]
 */

async function updateById(req, res) {
  try {
    const { id } = req.params;
    const { videoArray, playlistArray, deviceArray, name } = req.body;
    await zoneService.updateById(
      id,
      videoArray,
      playlistArray,
      deviceArray,
      name
    );
    return res.status(config.status_code.OK).send({ zone: true });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

/**
 *  @param {String} id
 */

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    await zoneService.deleteById(id);

    return res.status(config.status_code.OK).send({ zone: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

/**
 *  @param {String} id
 */

async function getById(req, res) {
  try {
    const { id } = req.params;
    const newZoneDocument = await zoneService.getById(id);
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const newZoneDocument = await zoneService.getAll();
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function addPlaylistToZone(req, res) {
  try {
    const { zoneId, playListIds } = req.body;
    let zoneDocument = await zoneService.getById(zoneId);
    let playlistDocument = await playlistService.getManyByArrayId(playListIds);
    for (let i = 0; i < zoneDocument["playlistArray"]; i++) {
      
    }
  } catch (error) {}
}

async function deletePlaylistFromZone(req, res) {
  try {
    const { zoneId, playListIds } = req.body;
    let zoneDocument = await zoneService.getById(zoneId);
    let playlistDocument = await playlistService.getManyByArrayId(playListIds);
    for (let i = 0; i < zoneDocument["playlistArray"]; i++) {}
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function addDeviceToZone(req, res) {
  try {
    const { zoneId, deviceId } = req.body;
    let zoneDocument = await zoneService.getById(zoneId);
    let deviceDocument = await deviceService.getById(deviceId);

    if (!deviceDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "device not found" });

    if (!zoneDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "zone not found" });

    if (zoneDocument["deviceArray"].includes(deviceDocument["_id"]))
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "device was added" });

    deviceDocument["deviceId"] = zoneDocument["_id"];

    zoneDocument["deviceArray"].push(deviceDocument["_id"]);
    await deviceService.insert(deviceDocument);
    await zoneService.insert(zoneDocument);

    return res
      .status(config.status_code.OK)
      .send({ deviceId: "deviceDocument" });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert: insert,
  getById: getById,
  getAll: getAll,
  deleteById: deleteById,
  updateById: updateById,
  addDeviceToZone: addDeviceToZone,
};

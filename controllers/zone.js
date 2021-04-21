const config = require("./../config/config");
const zoneService = require("./../services/zone");
const videoService = require("./../services/video")
const deviceService = require("./../services/device");
const playlistService = require("./../services/playlist");
const audio_module = require("./../exports/audio-io");

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
    let {
      videoArray,
      playlistArray,
      deviceArray,
      name,
      volumeVideo,
      isMuteVideo,
      isLoopOneVideo,
      isLoopAllVideo,
    } = req.body;

    let plId = []
    for (let i = 0; i < playlistArray.length; i++){
      plId.push(playlistArray[i]["_id"]);
    }
    let playlistDocument = await playlistService.getManyByArrayId(plId);
    let videoIds = []
    for (let i = 0; i < playlistDocument.length; i++) {
      videoIds.push.apply(videoIds, playlistArray[i]["mediaArray"]);
    }
    console.log(videoIds);
    videoIds = videoIds.filter(function (elem, pos) {
      return videoIds.indexOf(elem) == pos;
    });
    console.log(videoIds);
    let videoDocument = await videoService.getManyByArrayId(videoIds);
    videoArray = videoDocument;
    await zoneService.updateById(
      id,
      videoArray,
      playlistArray,
      deviceArray,
      name,
      volumeVideo,
      isMuteVideo,
      isLoopOneVideo,
      isLoopAllVideo
    );

    let zoneDocument = await zoneService.getById(id)

    audio_module
      .get_audio_io()
      .to(id)
      .emit("update-zone", (data = { zoneId: id }));

    return res.status(config.status_code.OK).send({ zone: zoneDocument });
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
    const deviceDocument = await deviceService.getManyByArrayId(
      newZoneDocument["deviceArray"]
    );
    newZoneDocument["deviceArray"] = deviceDocument;
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByIdforDevice(req, res) {
  try {
    const { zoneId } = req.body;
    let newZoneDocument = await zoneService.getById(zoneId);
    if (!newZoneDocument)
      newZoneDocument = {
        videoArray: [],
        playlistArray: [],
        name: "",
        volumeVideo: 50,
        isMuteVideo: false,
        isLoopOneVideo: false,
        isLoopAllVideo: false,
      };
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const newZoneDocument = await zoneService.getAll();
    return res.status(config.status_code.OK).send({ zones: newZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getZoneByDeviceId(req, res) {
  try {
    const { deviceId } = req.body;
    zoneDocument = await zoneService.getZoneByDeviceId(deviceId);
    return res.status(config.status_code.OK).send({ zone: zoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function removeDeviceFromZone(req, res) {
  try {
    const { zoneId, deviceId } = req.body;
    console.log(deviceId);
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

    if (!zoneDocument["deviceArray"].includes(deviceDocument["_id"]))
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "device was not added" });

    deviceDocument["zoneId"] = null;
    zoneDocument["deviceArray"] = zoneDocument["deviceArray"].filter(
      (device) => {
        return !device.equals(deviceDocument["_id"]);
      }
    );
    await deviceService.insert(deviceDocument);
    await zoneService.insert(zoneDocument);

    audio_module.get_audio_io().to(deviceId).emit("remove-device-in-zone", "");
    return res
      .status(config.status_code.OK)
      .send({ deviceId: "deviceDocument" });
  } catch (error) {
    console.log(error);
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

    deviceDocument["zoneId"] = zoneDocument["_id"];

    zoneDocument["deviceArray"].push(deviceDocument["_id"]);
    await deviceService.insert(deviceDocument);
    await zoneService.insert(zoneDocument);
    audio_module
      .get_audio_io()
      .to(deviceId)
      .emit(
        "add-device-into-zone",
        (payload = { to: deviceId, zoneId: zoneId })
      );    return res
      .status(config.status_code.OK)
      .send({ deviceId: "deviceDocument" });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function addPlaylistToZone(req, res){
  try {
    const {zoneId, playlistId} = req.body;
    let zoneDocument = await zoneService.getById(zoneId);
    let playlistDocument = await playlistService.getById(playlistId);

  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  insert: insert,
  getById: getById,
  getAll: getAll,
  getZoneByDeviceId: getZoneByDeviceId,
  getByIdforDevice: getByIdforDevice,
  deleteById: deleteById,
  updateById: updateById,
  addDeviceToZone: addDeviceToZone,
  removeDeviceFromZone: removeDeviceFromZone,
};

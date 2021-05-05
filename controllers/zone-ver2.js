const config = require("./../config/config");
const zoneService = require("./../services/zone-ver2");
const userService = require("./../services/user");
// const videoService = require("./../services/video");
const deviceService = require("./../services/device");
// const playlistService = require("./../services/playlist");
const audio_module = require("./../exports/audio-io");
const mongoose = require("mongoose");
const zoneSupport = require("./../utils/convertZoneDataForDevice");

async function insert(req, res) {
  try {
    const { name, price, formula } = req.body;
    if (name.toLowerCase() === "General") {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "'general' is a reserved name" });
    }
    const videoArray = [];
    const playlistArray = [];
    const deviceArray = [];
    const videoVolume = 0;
    const newZoneDocument = zoneService.createModel({
      videoArray,
      playlistArray,
      deviceArray,
      name,
      videoVolume,
      isMuteVideo: false,
      isLoopOneVideo: false,
      isLoopAllVideo: false,
      userId: req.userId,
      adArray: [],
      price,
      formula,
    });
    await zoneService.insert(newZoneDocument);
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

/**
 *  @param {String} id
 */

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    let zoneDocument = await zoneService.getById(id);
    if (zoneDocument["userId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    let deviceDocument = await deviceService.getManyByArrayId(
      zoneDocument["deviceArray"]
    );
    for (let i = 0; i < deviceDocument.length; i++) {
      deviceDocument[i]["zoneId"] = null;
      await deviceService.insert(deviceDocument[i]);
    }
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
    const newZoneDocument = await zoneService.getByIdwithAdName(id);
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

async function getAll(req, res) {
  try {
    const ZoneDocument = await zoneService.getAll();
    return res.status(config.status_code.OK).send({ zones: ZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByIdforDevice(req, res) {
  try {
    const { zoneId } = req.body;
    let ZoneDocument = await zoneService.getById(zoneId);
    if (!ZoneDocument)
      ZoneDocument = {
        videoArray: [],
        playlistArray: [],
        name: "",
        volumeVideo: 50,
        isMuteVideo: false,
        isLoopOneVideo: false,
        isLoopAllVideo: false,
        adArray: [],
        adArraySet: [],
      };
    let doc = await zoneSupport.convertZoneData(ZoneDocument);
    return res.status(config.status_code.OK).send({ zone: doc });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getZoneByDeviceId(req, res) {
  try {
    const { deviceId } = req.body;
    let zoneDocument = await zoneService.findByPipeLine({
      deviceArray: { $in: [mongoose.Types.ObjectId(deviceId)] },
    });
    let doc = await zoneSupport.convertZoneData(zoneDocument);
    return res.status(config.status_code.OK).send({ zone: doc });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function removeDeviceFromZone(req, res) {
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
      .emit("add-device-into-zone", { to: deviceId, zoneId: zoneId });
    return res.status(config.status_code.OK).send({ device: deviceDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getZoneByUserId(req, res) {
  try {
    const userId = req.userId;
    // console.log(videoIds);
    let zoneDocument = await zoneService.findByPipeLine(
      {
        userId: mongoose.Types.ObjectId(userId),
      },
      "_id name"
    );
    return res.status(config.status_code.OK).send({ zones: zoneDocument });
  } catch (error) {
    // console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function changeAdOfferToZone(req, res) {
  try {
    const zoneId = req.params.id;
    const { adArray } = req.body;
    let userDoc = await userService.getUserById(req.userId);
    let zoneDocument = await zoneService.getById(zoneId);
    if (
      userDoc["typeUser"].toString() != "bdManager" ||
      zoneDocument["userId"].toString() != req.userId
    )
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    zoneDocument["adArray"] = adArray;
    await zoneService.updateById(zoneId, {
      adArray: zoneDocument["adArray"],
    });
    zoneDocument = await zoneService.getById(zoneId);
    return res.status(config.status_code.OK).send({ zone: zoneDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { id } = req.params;
    let userDoc = await userService.getUserById(req.userId);
    let zoneDocument = await zoneService.getById(id);
    if (
      userDoc["typeUser"].toString() != "bdManager" ||
      zoneDocument["userId"].toString() != req.userId
    ) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }

    let {
      name,
      volumeVideo,
      isMuteVideo,
      isLoopOneVideo,
      isLoopAllVideo,
      adArray,
      price,
      formula,
    } = req.body;

    zoneDocument = await zoneService.updateById(id, {
      name,
      volumeVideo,
      isMuteVideo,
      isLoopOneVideo,
      isLoopAllVideo,
      adArray,
      price,
      formula,
    });
    zoneDocument = await zoneService.getByIdwithAdName(id);

    audio_module.get_audio_io().to(id).emit("update-zone", { zoneId: id });

    return res.status(config.status_code.OK).send({ zone: zoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert,
  getAll,
  getById,
  getByIdforDevice,
  getZoneByDeviceId,
  getZoneByUserId,
  deleteById,
  removeDeviceFromZone,
  addDeviceToZone,
  changeAdOfferToZone,
  updateById,
};

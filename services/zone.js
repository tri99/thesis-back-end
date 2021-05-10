const Zone = require("../collections/zone");
const mongoose = require("mongoose");
function createModel(
  videoArray,
  playlistArray,
  deviceArray,
  name,
  volumeVideo,
  userId
) {
  let newZoneModel = new Zone({
    videoArray: videoArray,
    playlistArray: playlistArray,
    deviceArray: deviceArray,
    name: name,
    volumeVideo: volumeVideo,
    isMuteVideo: false,
    isLoopOneVideo: false,
    isLoopAllVideo: false,
    userId: userId,
  });
  return newZoneModel;
}

function insert(newZoneDocument) {
  return new Promise((resolve, reject) => {
    newZoneDocument.save((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function getById(_id) {
  return new Promise((resolve, reject) => {
    Zone.findById(_id)
      .select()
      .exec((error, zoneDocument) => {
        if (error) return reject(error);
        return resolve(zoneDocument);
      });
  });
}

function getAll() {
  return new Promise((resolve, reject) => {
    Zone.find()
      .select()
      .exec((error, zoneDocument) => {
        if (error) return reject(error);
        return resolve(zoneDocument);
      });
  });
}

function deleteById(_id) {
  return new Promise((resolve, reject) => {
    Zone.deleteMany({ _id: _id }).exec((error) => {
      if (error) reject(error);
      return resolve(true);
    });
  });
}

function updateById(
  _id,
  videoArray,
  playlistArray,
  deviceArray,
  name,
  volumeVideo,
  isMuteVideo,
  isLoopOneVideo,
  isLoopAllVideo
) {
  return new Promise((resolve, reject) => {
    Zone.updateOne(
      { _id: _id },
      {
        name: name,
        videoArray: videoArray,
        playlistArray: playlistArray,
        deviceArray: deviceArray,
        volumeVideo: volumeVideo,
        isMuteVideo: isMuteVideo,
        isLoopOneVideo: isLoopOneVideo,
        isLoopAllVideo: isLoopAllVideo,
      }
    ).exec((error) => {
      if (error) reject(error);
      return resolve(error);
    });
  });
}

function getZoneByDeviceId(deviceId) {
  return new Promise((resolve, reject) => {
    Zone.find({ deviceArray: { $in: [mongoose.Types.ObjectId(deviceId)] } })
      .select()
      .exec((error, zoneDocument) => {
        if (error) return reject(error);
        return resolve(zoneDocument);
      });
  });
}

function getZoneByUserId(userId) {
  return new Promise((resolve, reject) => {
    Zone.find({ userId: userId })
      .select()
      .exec((error, zoneDocument) => {
        if (error) return reject(error);
        return resolve(zoneDocument);
      });
  });
}

/**
 *
 * @param {String} audioZoneId
 * @param {Array<String>} newVideos
 */
function addVideoArray(audioZoneId, newVideos) {
  return new Promise((resolve, reject) => {
    Zone.updateOne(
      { _id: audioZoneId },
      { $addToSet: { videoArray: { $each: newVideos } } }
    ).exec((error) => {
      if (error) reject(error);
      return resolve(true);
    });
  });
}

/**
 *  @param {Array} audioZoneIds
 *  @param {Array} newVideos
 */

function addVideoArrayByArrayAudioZoneId(audioZoneIds, newVideos, size) {
  return new Promise((resolve, reject) => {
    Zone.updateMany(
      { _id: audioZoneIds },
      { $addToSet: { videoArray: { $each: newVideos } }, size: size }
    ).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function removeVideoArrayByArrayAudioZoneId(audioZoneIds, newVideos, size) {
  return new Promise((resolve, reject) => {
    Zone.updateMany(
      { _id: audioZoneIds },
      { $pullAll: { videoArray: newVideos }, size: size }
    ).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function getZoneByPlaylistArrayId(playlistIds) {
  return new Promise((resolve, reject) => {
    Zone.find({ "playlistArray._id": { $in: playlistIds } })
      .select()
      .exec((error, zoneDocument) => {
        if (error) return reject(error);
        return resolve(zoneDocument);
      });
  });
}

function getZoneByVideoArrayId(videoIds) {
  let objectIdArray = videoIds.map((s) => mongoose.Types.ObjectId(s));
  return new Promise((resolve, reject) => {
    Zone.find({ "videoArray._id": { $in: objectIdArray } })
      .select()
      .exec((error, zoneDocument) => {
        if (error) return reject(error);
        return resolve(zoneDocument);
      });
  });
}

function getManyByUserId(userId) {
  return new Promise((resolve, reject) => {
    Zone.find({ userId: userId })
      .select("_id name")
      .exec((error, deviceDocument) => {
        if (error) return reject(error);
        return resolve(deviceDocument);
      });
  });
}

module.exports = {
  createModel: createModel,
  insert: insert,
  getById: getById,
  getAll: getAll,
  updateById: updateById,
  deleteById: deleteById,
  addVideoArray: addVideoArray,
  addVideoArrayByArrayAudioZoneId,
  removeVideoArrayByArrayAudioZoneId,
  getZoneByDeviceId: getZoneByDeviceId,
  getZoneByPlaylistArrayId: getZoneByPlaylistArrayId,
  getZoneByVideoArrayId: getZoneByVideoArrayId,
  getZoneByUserId: getZoneByUserId,
  getManyByUserId: getManyByUserId,
};

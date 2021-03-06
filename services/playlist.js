const Playlist = require("./../collections/playlist");
const basicCRUDGenerator = require("./basicCRUD");
const playlistCRUD = basicCRUDGenerator(Playlist);
function createModel(mediaArray, name, type, userId) {
  const playlistDocument = new Playlist({
    mediaArray: mediaArray,
    name: name,
    type: type,
    volume: 50,
    userId: userId,
  });
  return playlistDocument;
}

function insert(playlistDocument) {
  return new Promise((resolve, reject) => {
    playlistDocument.save((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function getAll() {
  return new Promise((resolve, reject) => {
    Playlist.find().exec((error, playlistDocument) => {
      if (error) return reject(error);
      return resolve(playlistDocument);
    });
  });
}
/**
 *
 * @param {String} zoneId
 */
// function getManyByZoneId(zoneId){
//     return new Promise((resolve, reject) => {
//         Playlist.find()
//           .in(playListIds)
//           .select()
//           .exec((error, playlistDocument) => {
//             if (error) return reject(error);
//             return resolve(playlistDocument);
//           });
//     })
// }

/**
 *
 * @param {Array} playListIds
 */
function getManyByArrayId(playListIds) {
  return new Promise((resolve, reject) => {
    Playlist.find({ _id: { $in: playListIds } })
      .select("_id mediaArray name type volume")
      .exec((error, playlistDocument) => {
        if (error) return reject(error);
        return resolve(playlistDocument);
      });
  });
}

function getById(playlistId) {
  return new Promise((resolve, reject) => {
    Playlist.findById(playlistId)
      .select()
      .exec((error, playlistDocument) => {
        if (error) return reject(error);
        return resolve(playlistDocument);
      });
  });
}

function deleteById(playlistId) {
  return new Promise((resolve, reject) => {
    Playlist.deleteOne({ _id: playlistId }).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function updateById(playlistId, name, mediaArray, volume) {
  return new Promise((resolve, reject) => {
    Playlist.updateOne(
      { _id: playlistId },
      { name: name, mediaArray: mediaArray, volume }
    ).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function getManyByUserId(userId) {
  return new Promise((resolve, reject) => {
    Playlist.find({ userId: userId })
      .select()
      .exec((error, videoDocument) => {
        if (error) return reject(error);
        return resolve(videoDocument);
      });
  });
}

module.exports = {
  ...playlistCRUD,
  createModel: createModel,
  insert: insert,
  getManyByArrayId: getManyByArrayId,
  getAll: getAll,
  getById: getById,
  updateById: updateById,
  deleteById: deleteById,
  getManyByUserId: getManyByUserId,
};

const Video = require("./../collections/video");

/**
 *
 * @param {Array} newVideos
 */

function insertMany(newVideos) {
  return new Promise((resolve, reject) => {
    Video.insertMany(newVideos, (error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function deleteDocument(VideoId) {
  return new Promise((resolve, reject) => {
    Video.deleteOne({ _id: VideoId }).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

/**
 *
 * @param {Array} VideoIds
 */
function getManyByArrayId(videoIds) {
  return new Promise((resolve, reject) => {
    Video.find({ _id: { $in: videoIds } })
      .select("path name duration size tag")
      .exec((error, videoDocument) => {
        if (error) return reject(error);
        return resolve(videoDocument);
      });
  });
}

function getManyByUserId(userId) {
  return new Promise((resolve, reject) => {
    Video.find({ userId: userId })
      .select("path name duration size tag")
      .exec((error, videoDocument) => {
        if (error) return reject(error);
        return resolve(videoDocument);
      });
  });
}

function createModel(name, duration, size, pathVideo, tag, userId) {
  const videoDocument = new Video({
    name: name,
    duration: duration,
    size: size,
    path: pathVideo,
    tag: tag,
    cDate: new Date(),
    mDate: new Date(),
    userId: userId,
  });
  return videoDocument;
}

function saveVideo(newVideoDocument) {
  return new Promise((resolve, reject) => {
    newVideoDocument.save((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function findOneById(videoId) {
  return new Promise((resolve, reject) => {
    return Video.findById(videoId)
      .select()
      .exec((error, videoDocument) => {
        if (error) return reject(error);
        return resolve(videoDocument);
      });
  });
}

function findAll() {
  return new Promise((resolve, reject) => {
    return Video.find()
      .select()
      .exec((error, videoDocument) => {
        if (error) return reject(error);
        return resolve(videoDocument);
      });
  });
}

function findOneByName(nameVideo) {
  return new Promise((resolve, reject) => {
    return Video.findOne({ name: nameVideo })
      .select("_id")
      .exec((error, videoDocument) => {
        if (error) return reject(error);
        return resolve(videoDocument);
      });
  });
}

module.exports = {
  insertMany: insertMany,
  deleteDocument: deleteDocument,
  getManyByArrayId: getManyByArrayId,
  getManyByUserId: getManyByUserId,
  createModel: createModel,
  saveVideo: saveVideo,
  findOneByName: findOneByName,
  findOneById: findOneById,
  findAll: findAll,
};

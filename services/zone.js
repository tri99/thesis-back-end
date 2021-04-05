const Zone = require("./../collections/zone");

function createModel(videoArray, playlistArray, deviceArray, name, videoVolume){
    let newZoneModel = new Zone({
      videoArray: videoArray,
      playlistArray: playlistArray,
      deviceArray: deviceArray,
      name: name,
      videoVolume: videoVolume,
    });
    return newZoneModel;
}

function insert(newZoneDocument){
    return new Promise((resolve, reject) => {
        newZoneDocument.save((error) => {
          if (error) return reject(error);
          return resolve(true);
        });
    })
}

function getById(_id){
    return new Promise ((resolve, reject) => {
        Zone.findById(_id).select().exec((error, zoneDocument) => {
            if(error) return reject(error);
            return resolve(zoneDocument);
        })
    })
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

function deleteById(_id){
    return new Promise ((resolve, reject) => {
        Zone.deleteMany({_id: _id}).exec(error => {
            if(error) reject(error);
            return resolve(true);
        }) 
    })
}

function updateById(_id, videoArray, playlistArray, deviceArray, name){
    return new Promise((resolve, reject) => {
        Zone.updateOne({_id: _id}, {name: name, videoArray: videoArray, playlistArray: playlistArray, deviceArray: deviceArray}).exec(error => {
            if(error) reject(error);
            return resolve(error);
        })
    })
}


/**
 * 
 * @param {String} audioZoneId
 * @param {Array<String>} newVideos
 */
function addVideoArray(audioZoneId, newVideos){
    return new Promise((resolve, reject) => {
        Zone.updateOne(
          { _id: audioZoneId },
          { $addToSet: { videoArray: { $each: newVideos } } }
        ).exec((error) => {
          if (error) reject(error);
          return resolve(true);
        });
    })
}

/**
 *  @param {Array} audioZoneIds
 *  @param {Array} newVideos
 */

function addVideoArrayByArrayAudioZoneId(
  audioZoneIds,
  newVideos,
  size
) {
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

function removeVideoArrayByArrayAudioZoneId(
  audioZoneIds,
  newVideos,
  size
) {
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
};
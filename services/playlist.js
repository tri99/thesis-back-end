const Playlist = require("./../collections/playlist");

function createModel(mediaArray, name, type){
    const playlistDocument = new Playlist({
        mediaArray: mediaArray,
        name: name,
        type: type
    });
    return playlistDocument;
}

function insert(playlistDocument){
    return new Promise((resolve, reject) => {
        playlistDocument.save((error) => {
            if(error) return reject(error);
            return resolve(true);
        })
    })
}

function getAll(){
    return new Promise((resolve, reject) => {
        Playlist.find().exec((error, playlistDocument) => {
            if(error) return reject(error);
            return resolve(playlistDocument);
        })
    })
}

/**
 * 
 * @param {Array} playListIds
 */
function getManyByArrayId(playListIds){
    return new Promise((resolve, reject) => {
        Playlist.find()
          .where("_id")
          .in(playListIds)
          .select()
          .exec((error, playlistDocument) => {
            if (error) return reject(error);
            return resolve(playlistDocument);
          });
    })
}

function deleteById(playlistId){
    return new Promise((resolve, reject) => {
        Playlist.deleteOne({_id: playlistId}).exec((error) => {
            if(error) return reject(error);
            return resolve(true);
        })
    })
}

function updateById(playlistId, mediaArray){
    return new Promise((resolve, reject) => {
        Playlist.updateOne({ _id: playlistId }, { mediaArray: mediaArray }).exec((error) => {
            if(error) return reject(error);
            return resolve(true);
        });
    })
}

module.exports = {
  createModel: createModel,
  insert: insert,
  getManyByArrayId: getManyByArrayId,
  getAll: getAll,
  updateById: updateById,
  deleteById: deleteById,
};
const playlistService = require("./../services/playlist");
const zoneService = require("../services/zone");

const config = require("./../config/config");

async function insert(req, res) {
  try {
    const { mediaArray, name, type } = req.body;
    const playlistDocument = playlistService.createModel(
      mediaArray,
      name,
      type,
      req.userId
    );
    await playlistService.insert(playlistDocument);
    return res
      .status(config.status_code.OK)
      .send({ playlist: playlistDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ messgae: error });
  }
}

async function getAll(req, res) {
  try {
    const playlistDocument = await playlistService.getAll();
    return res
      .status(config.status_code.OK)
      .send({ playlists: playlistDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getManyByArrayId(req, res) {
  try {
    const { playListIds } = req.body;
    const playlistArray = await playlistService.getManyByArrayId(playListIds);
    return res.status(config.status_code.OK).send({ playlist: playlistArray });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

// async function getManyByArrayZoneId(req, res) {
//   try {
//     const { zoneId } = req.query;
//     const playlistArrayIds = await playlistService.getManyByArrayId(playListIds);
//     return res.status(config.status_code.OK).send({ playlist: playlistArray });
//   } catch (error) {
//     return res.status(config.status_code.SERVER_ERROR).send({ message: error });
//   }
// }

async function updateById(req, res) {
  try {
    const playlistId = req.params.id;
    let playlistDocument = await playlistService.getById(playlistId);
    if (playlistDocument["userId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    const { name, mediaArray, volume } = req.body;
    await playlistService.updateById(playlistId, name, mediaArray, volume);
    return res.status(config.status_code.OK).send({ playlist: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const playlistId = req.params.id;

    let zoneDocument = await zoneService.getZoneByPlaylistArrayId([playlistId]);
    if (zoneDocument.length > 0) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "Some Zone include this playlist" });
    }
    let playlistDocument = await playlistService.getById(playlistId);
    if (playlistDocument["userId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await playlistService.deleteById(playlistId);
    return res.status(config.status_code.OK).send({ playlist: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getPlaylistByUserId(req, res) {
  try {
    const userId = req.userId;
    // console.log(videoIds);
    let playlistDocument = await playlistService.getManyByUserId(userId);
    return res
      .status(config.status_code.OK)
      .send({ playlists: playlistDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert: insert,
  getManyByArrayId: getManyByArrayId,
  getAll: getAll,
  getPlaylistByUserId: getPlaylistByUserId,
  updateById: updateById,
  deleteById: deleteById,
};

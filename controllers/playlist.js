const playlistService = require("./../services/playlist");
const config = require("./../config/config");


async function insert(req, res){
    try {
        const { mediaArray, name, type } = req.body;
        const playlistDocument = playlistService.createModel(
            mediaArray,
            name,
            type
        );
        await playlistService.insert(playlistDocument);
        return res
            .status(config.status_code.OK)
            .send({ playlist: playlistDocument });
    } catch (error) {
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ messgae: error });
    }
}

async function getAll(req, res) {
    try {
        const playlistDocument = await playlistService.getAll();
        return res.status(config.status_code.OK).send({playlist: playlistDocument});
    } catch (error) {
        return res.status(config.status_code.SERVER_ERROR).send({message: error});
    }
}

async function getManyByArrayId(req, res){
    try {
        const {playListIds} = req.body;
        const playlistArray = await playlistService.getManyByArrayId(playListIds);
        return res
          .status(config.status_code.OK)
          .send({ playlist: playlistArray });
    } catch (error) {
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
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
    const playlistId = req.params.id
    const {name, mediaArray } = req.body;
    await playlistService.updateById(playlistId, name, mediaArray);
    return res.status(config.status_code.OK).send({ playlist: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}


async function deleteById(req, res) {
  try {
    const  playlistId  = req.params.id;
    await playlistService.deleteById(playlistId);
    return res.status(config.status_code.OK).send({ playlist: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert: insert,
  getManyByArrayId: getManyByArrayId,
  getAll: getAll,
  updateById: updateById,
  deleteById: deleteById,
};
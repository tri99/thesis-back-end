const config = require("./../config/config");
const zoneService = require("./../services/zone");

async function insert(req, res){
    try {
        const {name} = req.body;
        const videoArray = []
        const playlistArray = [] 
        const deviceArray = []
        const videoVolume = 0
        const newZoneDocument = zoneService.createModel(
          videoArray,
          playlistArray,
          deviceArray,
          name,
          videoVolume
        );
        console.log(newZoneDocument);
        await zoneService.insert(newZoneDocument);
        return res
          .status(config.status_code.OK)
          .send({ zone: newZoneDocument });

    } catch (error) {
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
    }
}

async function updateById(req, res){
    try {
        const {_id} = req.query;
        const { videoArray, playlistArray, deviceArray, name } = req.body;
        await zoneService.updateById(
          _id,
          videoArray,
          playlistArray,
          deviceArray,
          name
        );
        return res
            .status(config.status_code.OK)
            .send({ zone: true });
    } catch (error) {
      console.log(error);
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
    }
}

async function deleteById(req, res) {
  try {
    const { _id } = req.query;
    await zoneService.deleteById(_id);
    return res.status(config.status_code.OK).send({ zone: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const { _id } = req.query;
    const newZoneDocument = await zoneService.getById(_id);
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
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert: insert,
  getById: getById,
  getAll: getAll,
  deleteById: deleteById,
  updateById: updateById
}
const config = require("./../config/config");
const zoneService = require("./../services/zone");

async function insert(req, res){
    try {
        const {name, videoArray, playlistArray, deviceArray, videoVolume} = req.body;
        const newZoneDocument = zoneService.createModel(
          name,
          videoArray,
          playlistArray,
          deviceArray,
          videoVolume
        );
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
        const { _id, videoArray, playlistArray, deviceArray, name } = req.body;
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
        return res
          .status(config.status_code.SERVER_ERROR)
          .send({ message: error });
    }
}

async function deleteById(req, res) {
  try {
    const { _id } = req.body;
    await zoneService.deleteById(_id);
    return res.status(config.status_code.OK).send({ zone: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const { _id } = req.body;
    const newZoneDocument = await zoneService.getById(_id);
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert: insert,
  getById: getById,
  deleteById: deleteById,
  updateById: updateById
}
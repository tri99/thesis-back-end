const videoService = require("./../services/video");

const config = require("./../config/config");
const audio_module = require("./../exports/audio-io");

const handle = require("./../services/handle");

function playVideo(req, res) {
  try {
    const { zoneId, videoId, deviceArray } = req.body;
    const data_to_send = {
      to: zoneId,
      videoId: videoId,
    };
    for (let index = 0; index < deviceArray.length; index++) {
      audio_module
        .get_audio_io()
        .to(deviceArray[index])
        .emit("play-video", data_to_send);
    }
    return res.status(200).send({ result: 0 });
  } catch (error) {
    return res.status(400).send({ result: 1 });
  }
}

function pauseVideo(req, res) {
  try {
    const { zoneId, videoId, deviceArray } = req.body;
    const data_to_send = {
      to: zoneId,
      videoId: videoId,
    };
    for (let index = 0; index < deviceArray.length; index++) {
      audio_module
        .get_audio_io()
        .to(deviceArray[index])
        .emit("pause-video", data_to_send);
    }
    return res.status(200).send({ result: 0 });
  } catch (error) {
    return res.status(400).send({ result: 1 });
  }
}

function volumeVideo(req, res) {
  try {
    const { zoneId, videoId, deviceArray, volume } = req.body;
    const data_to_send = {
      to: zoneId,
      videoId: videoId,
      volume: Number.parseInt(volume),
    };
    for (let index = 0; index < deviceArray.length; index++) {
      audio_module
        .get_audio_io()
        .to(deviceArray[index])
        .emit("volume-video", data_to_send);
    }
    // audio_module.get_audio_io().to(data_to_send.to).emit("volume-video", data_to_send);
    return res.status(200).send({ result: 0 });
  } catch (error) {
    return res.status(400).send({ result: 1 });
  }
}

async function getInforVideo(req, res) {
  try {
    const { zoneId } = req.body;
    const data_to_send = { to: zoneId };
    audio_module
      .get_audio_io()
      .to(data_to_send.to)
      .emit("get-infor-audio", data_to_send);
    return res.status(config.STATUS_CODE.OK).send({ result: config.SUCCESS });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  playVideo: playVideo,
  pauseVideo: pauseVideo,
  getInforVideo: getInforVideo,
  volumeVideo: volumeVideo,
};
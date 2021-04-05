const  videoService = require("./../services/video")

const config = require("./../config/config");
const audio_module = require("./../exports/audio-io");

const handle = require("./../services/handle")
async function insert(req, res){
    try {
        const {name, path, size, duration, tag} = req.body;
        const newVideoDocument = videoService.createModel(
          name,
          duration,
          size,
          path,
          tag
        );
        await videoService.saveVideo(newVideoDocument);
        return res.status(config.status_code.OK).send({video: newVideoDocument});
    } catch (error) {
        return res.status(config.status_code.SERVER_ERROR).send({message: error})
    }
}

async function deleteById(req, res){
    try {
        const {videoId} = req.body
        await videoService.deleteDocument(videoId);
        return res.status(status_code.OK).send({video: true});
    } catch (error) {
        return res.status(status_code.SERVER_ERROR).send({message: error})
    }
}

async function getManyByArrayId(req, res){
    try {
        const {videoIds} = req.body;
        const videoDocument = await videoService.getManyByArrayId(videoIds);
        return res.status(config.status_code.OK).send({video: videoDocument});
    } catch (error) {
        return res.status(config.status_code.SERVER_ERROR).send({message: error})
    }
}

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

async function getInforVideo(req, res){
  try {
    const {zoneId} = req.body;
    const data_to_send = {to: zoneId};
    audio_module
      .get_audio_io()
      .to(data_to_send.to)
      .emit("get-infor-audio", data_to_send);
    return res.status(config.STATUS_CODE.OK).send({ result: config.SUCCESS });
  } catch (error) {
    return res
      .status(config.status_code.SERVER_ERROR)
      .send({ message: error });
  }
}

async function upload(req,res){
  try {
    const duration = Number.parseInt(req.body.duration);
    const video = req.file;
    const nameVideo = handle.spliceExtention(video.originalname);
    const videoDocument = await videoService.findOneByName(nameVideo);
    if (videoDocument) {
      await handle.removeFile(video.path);
      return res.status(400).send({
        message:
          config.response_message
            .the_video_has_been_uploaded_before_please_check_back,
      });
    }

    let urlVideoGlobal = null;

    const typeVideo = handle.getTypeFile(video.mimetype);
    const signatureName = handle.getSignatureName();
    const nameVideoInPath = signatureName + "." + typeVideo;
    const pathVideoStorage = `${config.upload_folder}${config.video_folder}${nameVideoInPath}`;
    const videoSize = video.size;
    await handle.moveFile(video.path, pathVideoStorage);

    urlVideoGlobal = `${config.host}:${config.port}/${nameVideoInPath}`;
    const newVideo = videoService.createModel(
      nameVideo,
      duration,
      videoSize,
      urlVideoGlobal,
      []
    );
    await videoService.saveVideo(newVideo);

    return res.status(200).send({
      name: nameVideo,
      path: urlVideoGlobal,
      _id: newVideo._id,
      duration: duration,
    });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}





module.exports = {
  insert: insert,
  deleteById: deleteById,
  getManyByArrayId: getManyByArrayId,
  getInforVideo: getInforVideo,
  playVideo: playVideo,
  pauseVideo: pauseVideo,
  upload: upload,
};
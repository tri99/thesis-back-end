const videoService = require("./../services/video");
const zoneService = require("./../services/zone");
const config = require("./../config/config");
const audio_module = require("./../exports/audio-io");
const adSetService = require("./../services/adSet");
const handle = require("./../services/handle");

const trunk = require("../utils/trunk");

async function insert(req, res) {
  try {
    const { name, path, size, duration, tag } = req.body;

    const newVideoDocument = videoService.createModel(
      name,
      duration,
      size,
      path,
      tag
    );
    await videoService.saveVideo(newVideoDocument);
    return res.status(config.status_code.OK).send({ video: newVideoDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getManyByArrayId(req, res) {
  try {
    const { videoIds } = req.query;
    const videoDocument = await videoService.getManyByArrayId(videoIds);
    return res.status(config.status_code.OK).send({ video: videoDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const videoDocument = await videoService.findAll();
    return res.status(config.status_code.OK).send({ videos: videoDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
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

async function upload(req, res) {
  try {
    const duration = Number.parseFloat(req.body.duration);
    const adset = JSON.parse(req.body.adset);

    const video = req.file;
    const nameVideo = handle.spliceExtention(video.originalname);
    const videoDocument = await videoService.findOneBy({
      name: nameVideo,
      userId: req.userId,
    });
    if (videoDocument) {
      await handle.removeFile(video.path);
      return res.status(400).send({
        message:
          config.response_message
            .the_video_has_been_uploaded_before_please_check_back,
      });
    }
    const newAdSetDoc = adSetService.createModel({
      name: nameVideo,
      ages: adset.ages,
      genders: adset.genders,
      daysOfWeek: { value: [], strict: true },
      hoursOfDay: { value: [], strict: false },
      adManagerId: req.userId,
      isMedia: true,
    });

    await adSetService.insert(newAdSetDoc);

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
      [],
      req.userId,
      newAdSetDoc._id
    );
    await videoService.saveVideo(newVideo);

    return res.status(200).send({
      name: nameVideo,
      path: urlVideoGlobal,
      _id: newVideo._id,
      duration: duration,
      adSetId: {
        ages: adset.ages,
        genders: adset.genders,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const videoId = req.params.id;
    let videoDocument = await videoService.findOneById(videoId);

    const zoneDocument = await zoneService.getZoneByVideoArrayId([videoId]);
    videoDocument = await videoService.findOneById(videoId);
    if (videoDocument["userId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    if (zoneDocument.length > 0) {
      return res.status(config.status_code.FORBIDEN).send({
        message: `Some Zone include video ${trunk(videoDocument.name)}`,
      });
    }
    const adCount = await videoService.countAdContainVid(videoId, req.userId);
    if (adCount > 0) {
      return res.status(config.status_code.FORBIDEN).send({
        message: `Some active ad include video ${trunk(videoDocument.name)}`,
      });
    }
    if (!videoDocument) {
      return res.status(403).send({
        message: config.status_message.SOMETHING_WRONG,
      });
    }
    const withoutUri = `${config.host}:${config.port}/`;
    const pathVideoInURL = handle.getPathInURL(videoDocument.path, withoutUri);
    const pathVideoStorage = `${config.upload_folder}${config.video_folder}${pathVideoInURL}`;
    await handle.removeFile(pathVideoStorage);
    if (videoDocument["adSetId"])
      await adSetService.deleteById(videoDocument["adSetId"]);
    await videoService.deleteDocument(videoId);
    return res.status(config.status_code.OK).send({ video: true });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getVideosByUserId(req, res) {
  try {
    const userId = req.userId;
    // console.log(videoIds);
    let videoDocument = await videoService.getManyByUserId(userId);
    // console.log(videoDocument);
    return res.status(config.status_code.OK).send({ videos: videoDocument });
  } catch (error) {
    // console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateTagsById(req, res) {
  try {
    const videoId = req.params.id;
    const { tag } = req.body;
    // console.log(videoIds);
    let videoDocument = await videoService.findOneById(videoId);
    if (videoDocument["userId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    videoDocument = await videoService.findOneById(videoId);
    await videoService.updateTagsById(videoId, tag);
    // console.log(videoDocument);
    return res.status(config.status_code.OK).send({ videos: videoDocument });
  } catch (error) {
    // console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { id } = req.params;
    const { ages, genders } = req.body;
    let document = await videoService.getById(id);
    if (document["userId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    const adCount = await videoService.countAdContainVid(id, req.userId);

    if (adCount > 0) {
      return res.status(config.status_code.FORBIDEN).send({
        message: `Some active ad include video ${trunk(document.name)}`,
      });
    }
    await adSetService.updateById(document.adSetId, {
      ages,
      genders,
    });
    const updatedVideo = await videoService.getById(id);
    return res.status(config.status_code.OK).send({ video: updatedVideo });
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
  upload: upload,
  getAll: getAll,
  getVideosByUserId: getVideosByUserId,
  updateTagsById: updateTagsById,
  updateById,
};

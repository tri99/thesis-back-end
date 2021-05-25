const config = require("./../config/config");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.upload_folder + "/" + config.video_folder);
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 314572800,
  },
});

const uploadVideo = upload.single("video");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.upload_folder + "/" + config.image_folder);
  },
});

var imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 314572800,
  },
});

const uploadImage = imageUpload.single("image");

function catchErrorImage() {
  return (req, res, next) => {
    uploadImage(req, res, (error) => {
      if (error) {
        console.log("image: ", error);
        return res.status(413).send({
          message: "upload image error",
        });
      } else {
        next();
      }
    });
  };
}

function catchErrorVideo() {
  return (req, res, next) => {
    uploadVideo(req, res, (error) => {
      if (error) {
        console.log(error);
        return res.status(413).send({
          message: "oversize video",
        });
      } else {
        next();
      }
    });
  };
}

module.exports = {
  catchErrorVideo,
  catchErrorImage,
};

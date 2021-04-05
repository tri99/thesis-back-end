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

function catchErrorVideo() {
  return (req, res, next) => {
    uploadVideo(req, res, (error) => {
      if (error) {
          console.log(error);
        return res
          .status(413)
          .send({
            message: "oversize video",
          });
      } else {
        next();
      }
    });
  };
}

module.exports = {
  catchErrorVideo: catchErrorVideo,
};
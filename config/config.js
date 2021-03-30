module.exports = {
  host: "localhost",
  port: 3000,
  db: {
    username: "",
    password: "",
    host: "localhost",
    port: "27017",
    database: "chat",
  },
  status_code: {
    OK: 200,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    WRONG: 401,
    TOKEN_ERROR: 403,
  },
  status_message: {
    OK: "OK",
    WRONG_PASSWORD: "WRONG_PASS",
    NOT_FOUND: "NOT_FOUND",
    TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
    NOT_PERMISSION: "NOT_PERMISSION",
  },
  response_message: {
    the_video_has_been_uploaded_before_please_check_back:
      "The video has been uploaded before, please check back",
  },
  upload_folder: "./../upload/",
  video_folder: "videos/",
  image_folder: "images/"
  ,
  jwtKey: "NhetCaiKeyVoDay",
  algorithm: "HS512",
};
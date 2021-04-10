// const mm = require("music-metadata");
const fs = require("fs");
const path = require("path");
const config = require("./../config/config");
// const mongoose = require("mongoose");
// const sharp = require("sharp");
// const FormData = require("form-data");
// const request = require("request");
const uuid = require("uuid");
const jwt = require("./../utils/jwt");

function spliceExtention(name) {
  var fileName = path.parse(name).name;
  return fileName;
}

function removeFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function moveFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function getTypeFile(typeFile) {
  console.log(typeFile);
  const strings = typeFile.split("/");

  if (strings[1] == "mp4") {
    strings[1] = "mp4";
  } else if (strings[1] == "wave") {
    strings[1] = "wav";
  } else if (strings[1] == "x-flac") {
    strings[1] = "flac";
  } else if (strings[1] == "quicktime") {
    strings[1] = "mov";
  }
  return strings[1];
}

function getSignatureName() {
  return uuid.v4();
}

function getPathInURL(url, without) {
  const lengthWithout = without.length;
  const lengthURL = url.length;
  const path = url.substr(lengthWithout, lengthURL).trim();
  return path;
}

module.exports = {
  removeFile: removeFile,
  moveFile: moveFile,
  getTypeFile: getTypeFile,
  getSignatureName: getSignatureName,
  spliceExtention: spliceExtention,
  getPathInURL: getPathInURL,
};
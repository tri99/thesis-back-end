const mm = require("music-metadata");
const fs = require("fs");
const path = require("path");
const config = require("./../config/config");
const mongoose = require("mongoose");
const sharp = require("sharp");
const FormData = require("form-data");
const request = require("request");
const uuid = require("uuid");
const jwt = require("./../utils/jwt");


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
  const strings = typeFile.split("/");

  if (strings[1] == "mpeg") {
    strings[1] = "mp3";
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

module.exports = {
  removeFile: removeFile,
  moveFile: moveFile,
  getTypeFile: getTypeFile,
  getSignatureName: getSignatureName,
};
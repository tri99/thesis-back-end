const videoService = require("./../services/video");
const adOfferService = require("./../services/adOffer");

async function convertZoneData(data) {
  let adOfferDoc = await adOfferService.getManyFullInfor(data["adArray"]);
  let videoArray = [];
  for (let i = 0; i < adOfferDoc.length; i++) {
    videoArray.push(adOfferDoc[i]["contentId"]["mediaArray"]);
    data["playlistArray"].push(adOfferDoc[i]["contentId"]);
  }
  let videos = [...new Set(videoArray)];
  let videoDoc = await videoService.getManyByArrayIdFull(videos[0]);
  videoDoc = JSON.stringify(videoDoc);
  videoDoc = JSON.parse(videoDoc);
  for (let i = 0; i < videoDoc.length; i++) {
    videoDoc[i]["point"] = 0;
    videoDoc[i]["played"] = false;
  }
  data = JSON.stringify(data);
  data = JSON.parse(data);
  data["adArray"] = adOfferDoc;
  data["videoArray"] = videoDoc;
  console.log(data["videoArray"]);
  return data;
}

module.exports = {
  convertZoneData,
};

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
  console.log(videoDoc);
  data["adArray"] = adOfferDoc;
  data["videoArray"] = videoDoc;
  return data;
}

module.exports = {
  convertZoneData,
};

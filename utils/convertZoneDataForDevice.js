const videoService = require("./../services/video");
const adOfferService = require("./../services/adOffer");

async function convertZoneData(data) {
  let adOfferDoc = await adOfferService.getManyFullInfor(data["adArray"]);
  let videoArray = [];
  for (let i = 0; i < adOfferDoc.length; i++) {
    let videos = videoService.getManyByArrayIdFull(
      adOfferDoc[i]["contentId"]["mediaArray"]
    );
    let Atags = [];
    let Gtags = [];
    for (let j = 0; j < videos.length; j++) {
      Atags.push(videos["adSetId"]["ages"]);
      Gtags.push(videos["adSetId"]["genders"]);
    }
    adOfferDoc[i]["adSetId"]["ages"] = Atags;
    adOfferDoc[i]["adSetId"]["genders"] = Gtags;
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
  return data;
}

// let data = {
//   videoArray: [],
//   playlistArray: [],
//   deviceArray: [
//     {
//       _id: "609e41d701fe2c188863f392",
//     },
//   ],
//   adArray: [
//     {
//       _id: "60a36ed2d35e6e11c8a15abe",
//     },
//   ],
//   name: "cool",
//   volumeVideo: 0,
//   isMuteVideo: false,
//   isLoopOneVideo: false,
//   isLoopAllVideo: false,
//   userId: {
//     $oid: "609a303a8e271a3e806dc072",
//   },
//   __v: 1,
// };
// let x = await convertZoneData(data);
// console.log(x);

module.exports = {
  convertZoneData,
};

const jwt = require("./../utils/jwt");
const deviceService = require("./../services/device");
const adOfferService = require("./../services/adOffer");
const socketService = require("./../socket/index");
const reportVideoLog = require("./../services/reportVideoLog");
const NotificationService = require("./../services/notification");
const { getAgeTag } = require("../utils/ageGenders");
// module.exports.connect = (socket) => {
//   console.log("????");
//   socket.emit("send", "aloalo")
//   socket.on("greet", (data) => {
//     console.log(data);
//   });
// };

module.exports.connect = (socket) => {
  // socket.emit("connect", {})
  console.log("connect");
  socket.auth = false;
  socket.on("audio-leaved-zone", async (zoneId) => {
    socket.leave(zoneId);
  });
  socket.on("audio-joined-zone", async (zoneId) => {
    socket.join(zoneId);
  });

  socket.on("change-adOffer-status-empty", async (data) => {
    try {
      let adOfferDoc = await adOfferService.getById(data["adOfferId"]);
      if (!adOfferDoc) {
        console.log("no adOffer");
        return;
      }
      await adOfferService.updateById(data["adOfferId"], {
        status: "empty",
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", async () => {
    console.log(socket.device_id, " disconnected");
    await deviceService.updateStatusDevice(socket.device_id, false);
    let deviceDoc = await deviceService.getById(socket.device_id);
    socketService
      .getIO()
      .in(deviceDoc["userId"].toString())
      .emit(`/receive/update/socket/disconnect`, deviceDoc);
    await NotificationService.insertNotification(
      `Device **${deviceDoc["name"]}** has just disconnected`,
      deviceDoc["userId"],
      {
        type: "warn",
        link: `/`,
      }
    );
  });
  socket.on("authentication", async (data_authen) => {
    /**
     * @param data_authen {token: String}
     */
    try {
      // console.log(data_authen);
      if (!data_authen.token) return socket.disconnect();
      const decode_data = await jwt.verifyDevice(data_authen["token"]);
      socket.device_id = decode_data["id"];
      socket.auth = true;

      socket.join(decode_data["id"]);
      await deviceService.updateStatusDevice(socket.device_id, true);
      let payload = { deviceId: decode_data["id"] };

      // ============= CHECK DEVICE ==================================
      const deviceDocument = await deviceService.getById(decode_data["id"]);
      if (!deviceDocument) socket.disconnect();

      socket.join(deviceDocument["_id"]);
      if (deviceDocument["zoneId"]) {
        payload["zoneId"] = deviceDocument["zoneId"];
        socket.join(deviceDocument["zoneId"]);
      }

      socket.user_id = "admin";
      socketService
        .getIO()
        .in(deviceDocument["userId"].toString())
        .emit(`/receive/update/socket/connect`, deviceDocument);
      await NotificationService.insertNotification(
        `Device **${deviceDocument["name"]}** just connected`,
        deviceDocument["userId"],
        {
          type: "info",
          link: `/`,
        }
      );
      initFunction(socket, payload);
    } catch (error) {
      console.log(error);
    }
  });

  infor_video("infor-video", socket);
};

function initFunction(socket, payload) {
  // ===== ADD DEVICE JOIN ZONE ========================
  audio_joined_zone("audio-joined-zone", socket);
  // ===== REMOVE DEVICE FROM ZONE ========================
  audio_levead_zone("audio-leaved-zone", socket, payload);
  //   // ===== DEVICE DISCONNECT ===========================
  //   device_disconnected("disconnect", socket, payload);
  //   // ===== DEVICE CONNECTED ============================
  //   device_connected("device/audio/connected", payload);
  // ===== AUTHENTICATION SUCCESS ======================
  send_event_authentication_success("authentication-success", socket, payload);
  // ===== UPDATE ZONE FINISHED ========================
  // update_zone_finished("is_finished_update", socket);
  // ===== INFOR VIDEO ========================
  // infor_video("infor-video", socket);
  infor_ai_process("infor-ai-process", socket);
}

function send_event_authentication_success(event_name, socket, payload) {
  try {
    socket.emit(event_name, payload);
  } catch (error) {
    return;
  }
}

// function update_zone_finished(event_name, socket) {
//   socket.on(event_name, async (zone_id) => {
//     try {
//       await audioZoneService.updateIsFinishByAudioIdAndDeviceId(
//         zone_id,
//         socket.device_id,
//         true
//       );
//       requestAPI.get("update-zone-finished", {
//         zoneId: zone_id,
//         deviceId: socket.device_id,
//       });
//       return;
//     } catch (error) {
//       return;
//     }
//   });
// }

function audio_joined_zone(event_name, socket) {
  try {
    socket.on(event_name, (zone_id) => {
      socket.join(zone_id);
    });
  } catch (error) {
    return;
  }
}

function audio_levead_zone(event_name, socket) {
  try {
    socket.on(event_name, (zoneId) => {
      socket.leave(zoneId);
    });
  } catch (error) {
    return;
  }
}

function infor_video(event_name, socket) {
  socket.on(event_name, async (infor) => {
    try {
      infor["deviceId"] = socket.device_id;
      let userDoc = await deviceService.getById(socket.device_id);

      const zoneId = infor["zoneId"];
      // console.log(userDoc);
      socketService
        .getIO()
        .in(userDoc["userId"].toString())
        .emit(`/receive/update/${zoneId}/infor-video`, infor);
      console.log("video infor ++++++++++++++++++: ", infor);

      return;
    } catch (error) {
      console.log("infor video: ", error);
      return;
    }
  });
}

// const obj = {
//   adOfferId: null,
//   zoneId: null,
//   videoId: null,
//   durationFull: 300,
//   timeStamp: 1619946902.3998563,
//   snapshots: [
//     {
//       position: 0,
//       ages: [31.808628663119606],
//       genders: ["M"],
//       number_of_face: 1,
//       timeSnap: 1619947060.731988,
//     },
//   ],
// };
function infor_ai_process(event_name, socket) {
  socket.on(event_name, async (infor) => {
    try {
      // infor["deviceId"] = socket.device_id;
      // let userDoc = await deviceService.getById(socket.device_id);
      // socketService
      //   .getIO()
      //   .in(userDoc["userId"].toString())
      //   .emit(`/receive/update/socket/infor-ai-process`, infor);
      console.log("process ai infor -------------------------- ", infor);
      const totalAgeCounts = Array(9).fill(0);
      const totalGenderCounts = [0, 0];
      let totalFaces = 0;
      infor["snapshots"].forEach((ele) => {
        const { ages, genders } = ele;
        ages.map((age) => (totalAgeCounts[getAgeTag(age)] += 1));
        genders.map((gender) =>
          gender === "M" ? totalGenderCounts[0]++ : totalGenderCounts[1]++
        );
        totalFaces += ele["number_of_face"];
      });
      const adOffer = await adOfferService.getById(infor["adOfferId"]);

      let newReportVideoLogDoc = reportVideoLog.createModel({
        adOfferId: infor["adOfferId"],
        adManagerId: adOffer["adManagerId"],
        bdManagerId: adOffer["bdManagerId"],
        videoId: infor["videoId"],
        zoneId: infor["zoneId"],
        timeStart: infor["timeStamp"],
        deviceId: infor["deviceId"],
        runTime: infor["snapshots"].length * 5,
        views: totalFaces,
        ages: totalAgeCounts,
        genders: totalGenderCounts,
        raw: infor,
      });
      // console.log(newReportVideoLogDoc);
      await reportVideoLog.insert(newReportVideoLogDoc);
      return;
    } catch (error) {
      console.log("ai infor: ", error);
      return;
    }
  });
}

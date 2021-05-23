var io = null;
const jwt = require("./../utils/jwt");
const userService = require("./../services/user");
const adOfferService = require("./../services/adOffer");
const reportVideoLog = require("./../services/reportVideoLog");
/**
 * @returns {SocketIO.Server}
 */
function getIO() {
  return io;
}

/**
 *
 * @param {SocketIO.Server} IO
 */
function setIO(IO) {
  io = IO;
}

function getAgeTag(age) {
  const si = 0;
  if (age < 3) {
    return si;
  } else if (age < 10) {
    return si + 1;
  } else if (age < 20) {
    return si + 2;
  } else if (age < 30) {
    return si + 3;
  } else if (age < 40) {
    return si + 4;
  } else if (age < 50) {
    return si + 5;
  } else if (age < 60) {
    return si + 6;
  } else if (age < 70) {
    return si + 7;
  } else {
    return si + 8;
  }
}

function infor_ai_process(event_name, socket) {
  socket.on(event_name, async (infors) => {
    try {
      // infor["deviceId"] = socket.device_id;
      // let userDoc = await deviceService.getById(socket.device_id);
      // socketService
      //   .getIO()
      //   .in(userDoc["userId"].toString())
      //   .emit(`/receive/update/socket/infor-ai-process`, infor);
      for (const infor of infors) {
        const totalAgeCounts = Array(9).fill(0);
        const totalGenderCounts = [0, 0];
        let totalFaces = 0;

        infor["snapshots"].forEach((ele) => {
          const { ages, genders } = ele;
          ages.map((age) => (totalAgeCounts[getAgeTag(age)] += 1));
          genders.map((gender) =>
            gender === 10 ? totalGenderCounts[0]++ : totalGenderCounts[1]++
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
          deviceId: infor["deviceId"],
          timeStart: infor["timeStamp"],
          runTime: infor["snapshots"].length * 5,
          views: totalFaces,
          ages: totalAgeCounts,
          genders: totalGenderCounts,
          raw: infor,
        });
        await reportVideoLog.insert(newReportVideoLogDoc);
      }
      return;
    } catch (error) {
      console.log("socketError", error);
      return;
    }
  });
}

var currentSocket = null;
function connection() {
  io.on("connection", (socket) => {
    currentSocket = socket;
    socket.on("auth", async (token) => {
      if (!token) return socket.disconnect();
      const decode_data = await jwt.verifyToken(token["token"]);
      socket.user_id = decode_data["id"];
      socket.auth = true;
      let userDocument = await userService.getUserById(socket.user_id);
      if (!userDocument) return socket.disconnect();
      socket.join(socket.user_id);
      socket.emit("auth_success", socket.user_id);
    });
    infor_ai_process("test", socket);
  });
}
function getCurrentSocket() {
  return currentSocket;
}
module.exports = {
  connection: connection,
  getIO: getIO,
  setIO: setIO,
  getCurrentSocket,
};

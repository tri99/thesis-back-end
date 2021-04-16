const jwt = require("./../utils/jwt");
const deviceService = require("./../services/device");
const socketService = require("./../socket/index");

function connection(IO){
  IO.on("connection", socket => {
    console.log("aloalo");
  })
}

// module.exports.connect = (socket) => {
//   console.log("????");
//   socket.emit("send", "aloalo")
//   socket.on("greet", (data) => {
//     console.log(data);
//   });
// };

module.exports.connect = socket => {

  socket.auth = false;
  socket.on("authentication", async data_authen => {
      /**
       * @param data_authen {token: String}
       */
      try {
        // console.log(data_authen);
        if (!data_authen.token) return socket.disconnect();
        console.log(data_authen);
        const decode_data = await jwt.verifyDevice(data_authen["token"]);
        socket.device_id = decode_data["id"];
        socket.auth = true;
        
        socket.join(decode_data["id"]);
        let payload = { deviceId: decode_data["id"] };
        
        // ============= CHECK DEVICE ==================================
        const deviceDocument = await deviceService.getById(decode_data["id"]);
        if(!deviceDocument)
            socket.disconnect();
        payload["zoneId"] = deviceDocument["zoneId"];
        if (deviceDocument["zoneId"]) {
         
          socket.join(deviceDocument["zoneId"]);
        }
        socket.user_id = "admin";   
        initFunction(socket, payload);
      } catch (error) {
          console.log(error);
      }
  })
}

function initFunction(socket, payload){
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

function audio_levead_zone(event_name, socket, payload) {
  try {
    socket.on(event_name, (zoneId) => {
      socket.leave(zoneId);
    });
  } catch (error) {
    return;
  }
}

function device_disconnected(event_name, socket, payload){
    socket.on(event_name, async () => {
        try {
            socket.auth = false;
        } catch (error) {
            return
        }
    });
}


function infor_video(event_name, socket) {
  socket.on(event_name, (infor) => {
    try {
      infor["deviceId"] = socket.device_id;
      const zoneId = infor["zoneId"]
      socketService.getIO().emit(`/recive/update/${zoneId}/infor-video`, infor);
      return;
    } catch (error) {
      return;
    }
  });
}






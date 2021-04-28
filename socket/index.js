var io = null;
const jwt = require("./../utils/jwt");
const userService = require("./../services/user")
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

function connection(){
  io.on("connection", socket => {
    console.log("1111");
    socket.on("auth", async (token) => {
      if (!token)
        return socket.disconnect()
      const decode_data = await jwt.verifyToken(data_authen["token"]);
      socket.user_id = decode_data["id"];
      socket.auth = true;
      let userDocument = await userService.getUserById(socket.user_id);
      if (!userDocument)
        return socket.disconnect()
      socket.join(socket.user_id);
    })
  })
}

module.exports = {
  connection: connection,
  getIO: getIO,
  setIO: setIO,
};

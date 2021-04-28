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
      console.log(token);
      if (!token)
        return socket.disconnect()
      const decode_data = await jwt.verifyToken(token["token"]);
      socket.user_id = decode_data["id"];
      console.log(socket.user_id);
      socket.auth = true;
      let userDocument = await userService.getUserById(socket.user_id);
      console.log(userDocument);
      if (!userDocument)
        return socket.disconnect()
      console.log(socket.user_id);
      socket.join(socket.user_id);
      socket.emit("auth_success", socket.user_id);
    })
  })
}

module.exports = {
  connection: connection,
  getIO: getIO,
  setIO: setIO,
};

var io = null;

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
    socket.emit("respond", "aloalo")
  })
}

module.exports = {
  connection: connection,
  getIO: getIO,
  setIO: setIO,
};

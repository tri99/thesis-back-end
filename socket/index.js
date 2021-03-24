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

module.exports = {
  getIO: getIO,
  setIO: setIO,
};

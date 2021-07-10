const _ = require("underscore");
const audio_events = require("./../event_listener/audio_events");
const audio_module = require("./../exports/audio-io");

module.exports = (io) => {
  try {
    _.each(io.nsps, function (nsp) {
      nsp.on("connect", function (socket) {
        if (!socket.auth) {
          delete nsp.connected[socket.id];
        }
      });
    });
    // ======== AUDIO ================
    audio_module.namespace(io, "/audio");
    audio_module.get_audio_io().on("connection", audio_events.connect);
  } catch (error) {
    console.log(error);
  }
};

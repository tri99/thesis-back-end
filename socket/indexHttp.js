const audio_events = require("./../event_listener/audio_events");
const audio_module = require("./../exports/audio-io");


module.exports = io => {
    // audio_module.set_io(io);
    
    audio_module.namespace(io, "/audio");
    audio_module.get_audio_io().on("connection", audio_events.connection);
}
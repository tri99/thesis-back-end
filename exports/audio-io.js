var audio_io;

function set_io(io){
  audio_io = io
}

function namespace(io, of) {
  audio_io = io.of(of);
}

function get_audio_io() {
  return audio_io;
}

module.exports = {
  set_io: set_io,
  namespace: namespace,
  get_audio_io: get_audio_io,
};

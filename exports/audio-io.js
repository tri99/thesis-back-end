var audio_io;

function namespace(io, of) {
  audio_io = io.of(of);
}

function get_audio_io() {
  return audio_io;
}

module.exports = {
  namespace: namespace,
  get_audio_io: get_audio_io,
};

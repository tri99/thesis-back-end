const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const zoneSchema = new Schema({
    videoArray: {
        type: Array,
        require: true
    },
    playlistArray:{
        type: Array,
        required: true
    },
    deviceArray:{
        type: Array,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    volumeVideo:{
        type: Number,
        require: true
    }
})

const Zone = mongoose.model("zone", zoneSchema);

module.exports = Zone;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    serialNumber:{
        type: String,
        required: true
    },
    zoneId:{
        type: Schema.Types.ObjectId
    }
});

var device = mongoose.model("device", deviceSchema);
module.exports = device;
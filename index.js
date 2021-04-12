const express = require("express");
const http = require("http");
const app = express();
const appHttp = express();
const app_local = express();

const server = http.createServer(app);
const serverHttp = http.createServer(appHttp);
const serverLocal = http.createServer(app_local);

const cors = require("cors");
const socketIO = require("socket.io")(server);
const SocketService = require("./socket");
SocketService.setIO(socketIO);
const connectSocketHttp = require("./socket/indexHttp");

var ioHttp = require("socket.io")(serverHttp);

connectSocketHttp(ioHttp);

// socketio.setIO(IO);
// socketio.connection();

app.use(cors({ credentials: true, origin: true }));

const bodyParser = require("body-parser");

app.use(cors({ credentials: true, origin: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app_local.use(cors({ credentials: true, origin: false }));
app_local.use(bodyParser.json());
app_local.use(bodyParser.urlencoded({ extended: true }));

const config = require("./config/config");
const mongo = require("./db/mongo");
mongo.connectMongo();
app.use(express.static("public"));
app.use(express.static("upload/videos"));
app.use("/api/zones", require("./routes/zone")());
app.use("/api/videos", require("./routes/video")());

app_local.use("/api/video-control", require("./routes/videoController")());
// app.use("/api/devices", require("./routes/device")());
app.use("/api/playlists", require("./routes/playlist")());

server.listen(config.port, config.host, () => {
  console.log(1, `SERVER ON LISTENING: ${config.host}:${config.port}`);
});

serverHttp.listen(27117, config.host, () => {
  console.log(2, `SERVER http ON LISTENING: ${config.host}:27117`);
});

serverLocal.listen(27118, config.host, () => {
  console.log(3, `SERVER Local ON LISTENING: ${config.host}:27118`);
});

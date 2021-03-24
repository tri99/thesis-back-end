const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const socketio = require("./socket");


const IO = require("socket.io")(server);


socketio.setIO(IO);
socketio.connection();

app.use(cors({credentials: true, origin: true}));

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const config = require("./config/config");
const mongo = require("./db/mongo");
mongo.connectMongo();
app.use(express.static('public'));


server.listen(config.port, config.host, () => {
  console.log(1, `SERVER ON LISTENING: ${config.host}:${config.port}`);
});

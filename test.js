const io = require("socket.io-client");

const socket = io("ws://192.168.43.154:3000", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123",
  },
  query: {
    "my-key": "my-value",
  },
});

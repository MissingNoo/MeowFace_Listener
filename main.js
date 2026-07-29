//const http = require("node:http");
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');
const Valkey = require("iovalkey");
const valkey = new Valkey();

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, _rinfo) => {
  //console.log(JSON.parse(msg))
  const shapes = {};
  const json = JSON.parse(msg);
  json.BlendShapes.forEach(element => {
    shapes[element.k] = element.v;
  });
  const meowface = {
    Rotation_x : json.Rotation.x, 
    Rotation_y : json.Rotation.y, 
    Rotation_z : json.Rotation.z, 
    Position_x: json.Position.x, 
    Position_y: json.Position.y, 
    Position_z: json.Position.z, 
    VNyanPos_x: json.VNyanPos.x, 
    VNyanPos_y: json.VNyanPos.y, 
    VNyanPos_z: json.VNyanPos.z, 
    EyeLeft_x: json.EyeLeft.x, 
    EyeLeft_y: json.EyeLeft.y, 
    EyeLeft_z: json.EyeLeft.z, 
    EyeRight_x: json.EyeRight.x,
    EyeRight_y: json.EyeRight.y,
    EyeRight_z: json.EyeRight.z
  };
  //Store the position data and blendshapes on Valkey
  valkey.hset("BlendShapes", shapes);
  valkey.hset("MeowFace", meowface);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Connect MeowFace to ${address.address}:${address.port}`);
});

server.bind(8080);

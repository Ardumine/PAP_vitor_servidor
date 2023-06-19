//node server.js

console.log("A iniciar...");

const https = require("https");
  
// Express for handling GET and POST request
const express = require("express");
const app = express();
  
const fs = require("fs");
  

  
app.get("*", function (req, res) {
  try{
    res.sendFile(__dirname + req.path);

  }
  catch{
    res.sendStatus(404);
  }
});
  

    
  
 
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
  host: "*"
};
  

var servidor = https.createServer(options, app);

servidor.listen(5501, function (req, res) {
  console.log("Servidor iniciado! https://localhost:5501/main.html");
});
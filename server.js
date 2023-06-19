console.log("A iniciar...");

const https = require("https");
  
// Express for handling GET and POST request
const express = require("express");
const app = express();
  
const fs = require("fs");
  

  
app.get("*", function (req, res) {
    console.log("." + req.path);
  res.sendFile(__dirname + req.path);
});
  

    
  
 
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
  host: "*"
};
  

https.createServer(options, app)
.listen(5501, function (req, res) {
  console.log("Servidor iniciado!");
});
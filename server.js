// https server
const https = require("https");
  
// Express for handling GET and POST request
const express = require("express");
const app = express();
  
// Requiring file system to use local files
const fs = require("fs");
  

  
// Get request for root of the app
app.get("*", function (req, res) {
    console.log("." + req.path);
  res.sendFile(__dirname + req.path);
});
  

    
  
  
// Creating object of key and certificate
// for SSL
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};
  
// Creating https server by passing
// options and app object
https.createServer(options, app)
.listen(5500, function (req, res) {
  console.log("Server started at port 5500");
});
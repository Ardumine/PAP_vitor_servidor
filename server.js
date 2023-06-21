//node server.js
console.log("A iniciar...");
console.log("A compilar de novo...");
const { exec } = require('node:child_process')

// run the `ls` command using exec
exec('tsc', (err, output) => {
    // once the command has completed, the callback function is called
    if (err) {
        // log and return if we encounter an error
        console.error("ERRO A EXECUTAR: ", err)
        process.exit(1)
    }
    // log the output received from the command
    console.log("Saida: ", output)
})



const https = require("https");
  
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
  console.log("Se o link não der no opera, !!ABRIR NO EDGE!!");
  console.log("Servidor iniciado! https://localhost:5501/main.html");
});
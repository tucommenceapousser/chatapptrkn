const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const dotenv = require("dotenv"); // Ajoutez cette ligne pour utiliser .env
dotenv.config(); // Chargez les variables d'environnement depuis .env

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

var rooms = [];
var usernames = [];
var adminRoomPassword = process.env.PASS1; // Mot de passe pour la salle d'administration depuis .env
var privateRoomPassword = process.env.PASS2; // Deuxième mot de passe depuis .env

io.on('connection', function(socket){

  socket.on("join", function(room, username, password){
    if (username != ""){
      if (room === "admin" && password !== adminRoomPassword) {
        // Mot de passe incorrect pour la salle d'administration
        socket.emit("receive", "Server : Mot de passe incorrect pour la salle d'administration.");
        return;
      } else if (room === "private" && password !== privateRoomPassword) {
        // Mot de passe incorrect pour la salle privée
        socket.emit("receive", "Server : Mot de passe incorrect pour la salle privée.");
        return;
      }

      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("receive", "Server : " + username + " has entered the chat.");
      socket.emit("join", room);
    }
  })

  socket.on("send", function(message){
    io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] +" : " + message);
  })

  socket.on("recieve", function(message){
    socket.emit("recieve", message);
  })
})
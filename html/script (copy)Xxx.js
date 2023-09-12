var socket;
var usernameInput;
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

function onload() {
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");

  // Masquer la section des messages au chargement de la page
  document.getElementById("Chat").style.display = "none";

  socket.on("join", function (room) {
    chatRoom.innerHTML = "Chatroom : " + room;
  });

  socket.on("recieve", function (message) {
    console.log(message);
    if (messages.length < 9) {
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    } else {
      messages.shift();
      messages.push(message);
    }
    for (i = 0; i < messages.length; i++) {
      document.getElementById("Message" + i).innerHTML = messages[i];
      document.getElementById("Message" + i).style.color = "#fff000";
    }
  });
}

function Connect() {
  const room = chatIDInput.value;
  const username = usernameInput.value;

  if (room === "admin") {
    // Si la salle demandée est "admin", demander le mot de passe
    const password = prompt("Mot de passe pour la salle admin:");

    // Envoyer la demande de connexion avec le mot de passe
    socket.emit("join", room, username, password);
  } else {
    // Pour les autres salles, connectez-vous sans mot de passe
    socket.emit("join", room, username, null);
  }
  // Afficher la section des messages lorsque l'utilisateur se connecte
  document.getElementById("Chat").style.display = "block";
  
  socket.emit("join", chatIDInput.value, usernameInput.value);
}

function Send() {
  if (delay && messageInput.value.replace(/\s/g, "") != "") {
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}

function delayReset() {
  delay = true;
}
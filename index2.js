var firebaseConfig = {
  apiKey: "AIzaSyD69EJwLEA2zQpGeUXK2XHRg69Ca-fTpzc",
    authDomain: "the-amazing-jukebox.firebaseapp.com",
    databaseURL: "https://the-amazing-jukebox-default-rtdb.firebaseio.com",
    projectId: "the-amazing-jukebox",
    storageBucket: "the-amazing-jukebox.appspot.com",
    messagingSenderId: "778454163688",
    appId: "1:778454163688:web:f7198448fb38dee2cb695d",
    measurementId: "G-G2E58RL3ZG"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const username = prompt("Please Tell Us Your Name");

function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/" + timestamp).set({
    username,
    message,
  });
}

const fetchChat = db.ref("messages");

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${
    username === messages.username ? "sent" : "receive"
  }><span>${messages.username}: </span>${messages.message}</li>`;
  // append the message on the page
  document.getElementById("messages").innerHTML += message;
});
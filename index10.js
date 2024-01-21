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
  
  let username = "";
  
  function showUsernameModal() {
    const usernameModal = document.getElementById("username-modal");
    usernameModal.style.display = "block";
  }
  
  function closeUsernameModal() {
    const usernameModal = document.getElementById("username-modal");
    usernameModal.style.display = "none";
  }
  
  function setUsername() {
    const usernameInput = document.getElementById("username-input");
    username = usernameInput.value.trim();
  
    if (username === "") {
      alert("Please enter a valid username.");
      return;
    }
  
    const usernameModal = document.getElementById("username-modal");
    usernameModal.style.display = "none"; // Oculta la ventana emergente
  
    const welcomeMessage = "Bienvenido, " + username + "!";
    displayMessage("", welcomeMessage);

    // Enviar mensaje de bienvenida a la base de datos
    db.ref("messages/").push({
      username: "The Amazing Jukebox",
      message: welcomeMessage,
    });

    // Puedes realizar otras acciones después de establecer el nombre de usuario, si es necesario
  
    // Además, puedes descomentar la siguiente línea si deseas redirigir al usuario después de establecer el nombre de usuario
    // window.location.href = "tu_pagina.html";
}

  
  // Agrega esta función para seleccionar un emoji
  function selectEmoji(emoji) {
      const messageInput = document.getElementById("message-input");
      messageInput.value += emoji;
  
      // También puedes cerrar el contenedor de emojis si es necesario
      const emojiContainer = document.getElementById("emoji-container");
      emojiContainer.style.display = "none"; // Oculta el contenedor de emojis después de seleccionar uno
  }
  
  // Actualiza la función toggleEmojiPicker para mostrar/ocultar el contenedor de emojis
  function toggleEmojiPicker() {
      const emojiContainer = document.getElementById("emoji-container");
      emojiContainer.style.display = emojiContainer.style.display === "none" ? "flex" : "none";
  }
  
  
  
  // Función para mostrar un mensaje en el chat
  // Función para mostrar un mensaje en el chat
  function displayMessage(sender, message) {
    const timestamp = Date.now();
    const systemMessage = `<li class="system">${message} ${sender}</li>`;
  
    // Anexar el mensaje en la página
    document.getElementById("messages").innerHTML += systemMessage;
  
    // Desplazarse automáticamente hacia abajo
    // Desplazarse automáticamente hacia el último mensaje
  const messagesContainer = document.getElementById("messages");
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Manejo del evento submit del formulario
document.getElementById("message-form").addEventListener("submit", function (e) {
  e.preventDefault();
  sendMessage();
});

function shareCurrentSong() {
    if (currentVideoIndex >= 0 && currentVideoIndex < videos.length) {
        const currentSong = songInfo[videos[currentVideoIndex].src];
        if (currentSong) {
            const songSrc = videos[currentVideoIndex].src;
            const localLink = `#song-${songSrc}`;
            const message = `🎶 Now playing: <a class="song-link" href="${localLink}" data-src="${songSrc}" target="_blank">${currentSong.name} by ${currentSong.artist}</a>`;

            displayMessage(username, message);
            
            // También envía el mensaje a la base de datos cada vez que se llama
            db.ref("messages/").push({
                username: username,
                message: message,
            });

             // Manejo del clic en el enlace para evitar la recarga de la página
             const songLink = document.querySelector('.song-link');
             songLink.addEventListener('click', function (event) {
                 event.preventDefault(); // Evita la acción predeterminada del enlace
                 // Tu lógica adicional aquí, como cargar el video correspondiente
                 loadVideo(songSrc);
             });
         }
     }
 }
        
    


function saveMessageToDatabase(sender, message) {
    const messagesRef = db.ref("messages"); // Referencia a la colección de mensajes
    const newMessageRef = messagesRef.push(); // Generar una nueva clave única
    newMessageRef.set({
        username: sender,
        message: message,
    });
}

  
  
  const MESSAGES_TO_LOAD = 3;
  // Referencia para el chat
  const fetchChat = db.ref("messages/");
  
  // Manejo del evento child_added
  fetchChat.limitToLast(MESSAGES_TO_LOAD).on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
    // Anexar el mensaje en la página
    document.getElementById("messages").innerHTML += message;
  
     // Desplazarse automáticamente hacia abajo
     const messagesContainer = document.getElementById("messages");
     messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
  
  // Llama a la función para mostrar la ventana emergente
  showUsernameModal();
  
  // Función para enviar un mensaje
  function sendMessage() {
    // obtener valores a enviar
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
  
    // Limpiar el cuadro de entrada
    messageInput.value = "";
  
    // Desplazarse automáticamente hacia abajo
    document
      .getElementById("messages")
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  
    // Crear la colección en la base de datos y enviar los datos
    db.ref("messages/" + timestamp).set({
      username,
      message,
    });
  }
  
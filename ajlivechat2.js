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
    
    // Crear la colección en la base de datos y enviar los datos para el mensaje de bienvenida
    const timestamp = Date.now();
    const welcomeMessageData = {
        username: "",
        message: welcomeMessage,
    };

    // Verificar si el mensaje ya existe en la base de datos antes de agregarlo
    const messagesRef = db.ref("messages/");
    messagesRef.orderByChild("message").equalTo(welcomeMessage).once("value", snapshot => {
        const existingMessages = snapshot.val();
        if (!existingMessages) {
            messagesRef.child(timestamp).set(welcomeMessageData);
        }
    });

    // Mostrar el mensaje de bienvenida en el chat localmente
    

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
    console.log("displayMessage called with sender:", sender, "and message:", message);

    const timestamp = Date.now();
    let displaySender = sender ? sender + ":" : ""; // Mostrar el sender solo si está presente
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
            const timestamp = Date.now();
            const message = `🎶 Now playing: <a href="#" onclick="playSongById(${currentSong.id}); return false;">${currentSong.name} by ${currentSong.artist}</a>`;
            
            // Guardar el mensaje en la base de datos
            db.ref("messages/" + timestamp).set({
                username,
                message,
            });
        }}}

        function playSongById(id) {
            // Encuentra el índice de la canción con el id proporcionado
            const index = videos.findIndex(video => songInfo[video.src].id === id);
        
            // Si se encontró la canción, cámbiala y reprodúcela
            if (index !== -1) {
                currentVideoIndex = index;
                videoPlayer.src = videos[currentVideoIndex].src;
                videoPlayer.load();
                videoPlayer.play();
                const likeButton = document.getElementById("like-button");
                likeButton.disabled = false; // Habilitar botón para cada nueva canción
            }
        }
    
        function generateSongLink(songSrc) {
            const encodedInfo = btoa(JSON.stringify({ songSrc: songSrc }));
            return window.location.origin + window.location.pathname + `?song=${encodedInfo}`;
        }
        
        const queryParams = new URLSearchParams(window.location.search);
            const encodedInfo = queryParams.get("song");
        
            if (encodedInfo) {
                try {
                    const decodedInfo = JSON.parse(atob(encodedInfo));
                    const songIndex = videos.findIndex(video => video.src === decodedInfo.songSrc);
        
                    if (songIndex !== -1) {
                        currentVideoIndex = songIndex;
                        playNextVideo();
                    }
                } catch (error) {
                    console.error("Error decoding song info from URL:", error);
                }
            }
        ;



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
  
// Cambia el manejo del evento child_added para que funcione con la nueva lógica
fetchChat.limitToLast(MESSAGES_TO_LOAD).on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const message = `<li class=${username === messages.username ? "sent" : "receive"}><span>${messages.username}: </span>${messages.message}</li>`;

    // Añade el mensaje al contenedor de mensajes
    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML += message;

    // Desplázate automáticamente hacia abajo
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
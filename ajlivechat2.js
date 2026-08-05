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

    const welcomeMessage = "Welcome, " + username + "!";
    
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
        const currentSong = songInfo[videos[currentVideoIndex].key];
        if (currentSong) {
            const timestamp = Date.now();
            const message = `🎶 Listen to this one: <a href="#" onclick="playSongById(${currentSong.id}); return false;">${currentSong.name} by ${currentSong.artist}</a>`;
            
            // Guardar el mensaje en la base de datos
            db.ref("messages/" + timestamp).set({
                username,
                message,
            });
        }}}

        function playSongById(id) {
       // Encuentra el índice de la canción con el id proporcionado
    const index = videos.findIndex(video => songInfo[video.key].id === id);
        
       // Si se encontró la canción, cámbiala y reprodúcela
    if (index !== -1) {
        currentVideoIndex = index;
        const current = videos[currentVideoIndex];

        if (current.src.startsWith("yt:")) {
            const videoId = current.src.replace("yt:", "");
            ytPlayer.loadVideoById(videoId);
            if (soundEnabled) ytPlayer.unMute();
        } else {
            videoPlayer.src = current.src;
            videoPlayer.load();
            videoPlayer.play();
        }

        const likeButton = document.getElementById("like-button");
        likeButton.disabled = false;
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
                    const songIndex = videos.findIndex(video => video.key === decodedInfo.songSrc);
        
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


  
  
  const MESSAGES_TO_LOAD = 1;
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
   
  
    // Crear la colección en la base de datos y enviar los datos
    db.ref("messages/" + timestamp).set({
      username,
      message,
    });
  }

  const toggleChatBtn = document.getElementById("toggle-chat-btn");
const toggleIcon = document.getElementById("toggle-icon");

// Agrega un evento para 'touchend' y 'click'
toggleChatBtn.addEventListener("touchend", function() {
    toggleIcon.classList.add('active');
    
    // Elimina la clase después de 900ms
    setTimeout(function() {
        toggleIcon.classList.remove('active');
    }, 600);
});

toggleChatBtn.addEventListener("click", function() {
    toggleIcon.classList.add('active');
    
    // Elimina la clase después de 900ms
    setTimeout(function() {
        toggleIcon.classList.remove('active');
    }, 600);
});


document.querySelectorAll('.custom-button').forEach(button => {
  button.addEventListener('touchstart', function() {
      // Agrega la clase para el efecto
      this.classList.add('active');
      
      // Elimina la clase después de 400ms para simular el "toque"
      setTimeout(() => {
          this.classList.remove('active');
      }, 600); // Ajusta el tiempo según la duración que quieras para el efecto
  });
  
  button.addEventListener('mousedown', function() {
      this.classList.add('active');
  });

  button.addEventListener('mouseup', function() {
      setTimeout(() => {
          this.classList.remove('active');
      }, 600);
  });
  
  button.addEventListener('mouseleave', function() {
      this.classList.remove('active');
  });
});


function toggleEmojiPicker() {
    const emojiButton = document.getElementById('emoji-button');
    const emojiContainer = document.getElementById('emoji-container');

    // Alternar la visibilidad del contenedor de emojis
    emojiContainer.style.display = emojiContainer.style.display === "none" ? "flex" : "none";

    // Agregar la clase 'active' para que se aplique el "salto"
    emojiButton.classList.add('active');

    // Después de 400ms (o el tiempo de la transición), quitar la clase 'active'
    setTimeout(() => {
        emojiButton.classList.remove('active');
    }, 400); // Asegúrate de que este tiempo coincida con la duración de la transición en el CSS
}

document.getElementById("message-btn").addEventListener("touchend", function() {
    this.blur(); // Remueve el foco del botón
});



document.querySelector('#like-button').addEventListener('touchstart', function() {
    this.style.transform = 'translate(-50%, -50%) scale(0.93)';
});

document.querySelector('#like-button').addEventListener('touchend', function() {
    this.style.transform = 'translate(-50%, -50%) scale(1)';
});


document.querySelector('#next-song-button').addEventListener('touchstart', function() {
    this.style.transform = 'translate(-50%, -50%) scale(0.95)';
});

document.querySelector('#next-song-button').addEventListener('touchend', function() {
    this.style.transform = 'translate(-50%, -50%) scale(1)';
});

document.querySelector('#liked-songs-button').addEventListener('touchstart', function() {
    this.style.transform = 'translate(-50%, -50%) scale(0.95)';
});

document.querySelector('#liked-songs-button').addEventListener('touchend', function() {
    this.style.transform = 'translate(-50%, -50%) scale(1)';
});


function toggleMenu(button) {
    var menu = document.getElementById('menu');
    menu.classList.toggle('show');
    
    // Cambiar entre hamburguesa y X
    if (menu.classList.contains('show')) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
        // Cerrar todos los cuadros de información al cerrar el menú
        closeAllInfoBoxes();
    }
}

document.getElementById('menu-toggle').addEventListener('click', function() {
    toggleMenu(this);
});

document.getElementById('about-us-link').addEventListener('click', function() {
    toggleInfoBox('about-us-content');
});

document.getElementById('contact-us-link').addEventListener('click', function() {
    toggleInfoBox('contact-us-content');
});

// NUEVO BLOQUE: Get the App
document.getElementById('get-the-app-link').addEventListener('click', function() {
    toggleInfoBox('get-the-app-content');
});

function toggleInfoBox(boxId) {
    var box = document.getElementById(boxId);
    box.classList.toggle('show');

    // Lista de todos los cuadros disponibles
    var allBoxes = [
        'about-us-content',
        'contact-us-content',
        'get-the-app-content'
    ];

    // Ocultar todos los demás cuadros
    allBoxes.forEach(function(id) {
        if (id !== boxId) {
            document.getElementById(id).classList.remove('show');
        }
    });
}

function closeAllInfoBoxes() {
    document.getElementById('about-us-content').classList.remove('show');
    document.getElementById('contact-us-content').classList.remove('show');
    document.getElementById('get-the-app-content').classList.remove('show');
}



function toggleDiscoMode() {
    var discoGif = document.getElementById("disco-gif");
    var discoLabel = document.getElementById("disco-mode-label");
    var discoBackground = document.getElementById("disco-background");

    // Alterna la visibilidad del GIF
    if (discoGif.style.display === "none") {
        discoGif.style.display = "block"; // Muestra el GIF
        discoLabel.style.display = "block"; // Muestra la etiqueta
        discoBackground.style.display = "block"; // Muestra el fondo oscuro
    } else {
        discoGif.style.display = "none"; // Oculta el GIF
        discoLabel.style.display = "none"; // Oculta la etiqueta
        discoBackground.style.display = "none"; // Oculta el fondo oscuro
    }
}





function generateVerticalStars() {
    const discoBackground = document.getElementById('disco-background');
    
    for (let i = 0; i < 20; i++) { // Generar 135 estrellas
        const star = document.createElement('img');
        star.src = 'starlight3.webp'; // Reemplaza con la ruta de tu nuevo PNG
        star.classList.add('vertical-star');

        // Posición inicial aleatoria
        setRandomPosition(star); 
        
        // Tamaño aleatorio para más variación
        const size = Math.random() * 17 + 5; // Tamaño entre 5px y 30px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Duración aleatoria para el efecto fade in/out
        const fadeDuration = Math.random() * -15 + 37; // Duración entre 22s y 37s
        star.style.animationDuration = `${fadeDuration}s`;

        // Retraso aleatorio para que no todas aparezcan al mismo tiempo
        const delay = Math.random() * 10; // Hasta 10 segundos de retraso
        star.style.animationDelay = `${delay}s`;

        // Añadir el movimiento en S
        star.style.animation += `, moveInSvert 5s ease-in-out infinite`; // Agrega el movimiento en S con duración de 5s

        // Cambiar posición en cada iteración de la animación
        star.addEventListener('animationiteration', () => {
            setRandomPosition(star); // Cambiar la posición en cada iteración
        });

        // Añadir la estrella al fondo
        discoBackground.appendChild(star);
    }
}

// Función para establecer una posición aleatoria
function setRandomPosition(star) {
    star.style.left = Math.random() * 30 + 'vw'; // Posición horizontal aleatoria

    let minVH = 10;
    let maxVH = 70;

    // Solo desktop (mouse real)
    if (window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches) {
        minVH = 50;
        maxVH = 150;
    }

    star.style.top = (Math.random() * (maxVH - minVH) + minVH) + 'vh';
}


// Ejecutar la función una vez cargado el DOM
document.addEventListener('DOMContentLoaded', generateVerticalStars);



function generateHorizontalStars() {
    const discoBackground = document.getElementById('disco-background');

    for (let i = 0; i < 20; i++) { // Generar 135 estrellas
        const star = document.createElement('img');
        star.src = 'starlight3.webp'; // Reemplaza con la ruta de tu nuevo PNG
        star.classList.add('horizontal-star');

        // Posición inicial aleatoria
        setRandomPosition(star); 
        
        // Tamaño aleatorio para más variación
        const size = Math.random() * 17 + 5; // Tamaño entre 15px y 25px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Duración aleatoria para el efecto fade in/out
        const fadeDuration = Math.random() * -15 + 37; // Duración entre 22s y 37s
        star.style.animationDuration = `${fadeDuration}s`;

        // Retraso aleatorio para que no todas aparezcan al mismo tiempo
        const delay = Math.random() * 10; // Hasta 10 segundos de retraso
        star.style.animationDelay = `${delay}s`;

        // Añadir el movimiento en S
        star.style.animation += `, moveInShor 5s ease-in-out infinite`; // Agrega el movimiento en S con duración de 5s

        // Cambiar posición en cada iteración de la animación
        star.addEventListener('animationiteration', () => {
            setRandomPosition(star); // Cambiar la posición en cada iteración
        });

        // Añadir la estrella al fondo
        discoBackground.appendChild(star);
    }
}

// Función para establecer una posición aleatoria
function setRandomPosition(star) {
    star.style.left = Math.random() * 30 + 'vw'; // Posición horizontal aleatoria

    let minVH = 10;
    let maxVH = 70;

    // Solo desktop (mouse real)
    if (window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches) {
        minVH = 50;
        maxVH = 150;
    }

    star.style.top = (Math.random() * (maxVH - minVH) + minVH) + 'vh';
}


// Ejecutar la función una vez cargado el DOM
document.addEventListener('DOMContentLoaded', generateHorizontalStars);



function generateTwinklingStars() {
    const discoBackground = document.getElementById('disco-background');
    
    // Función para detectar si es una pantalla grande
    const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;

    for (let i = 0; i < 175; i++) { // Generar 345 estrellas
        const star = document.createElement('img');
        star.src = 'starlight2.webp';
        star.classList.add('star');
        
        setRandomPosition(star);

        // Verificar si es pantalla grande y ajustar el tamaño
        let size;
        if (isLargeScreen) {
            size = Math.random() * 27 + 10; // Tamaño entre 10px y 30px en pantallas grandes
        } else {
            size = Math.random() * 17 + 5; // Tamaño entre 5px y 16px en pantallas pequeñas
        }
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Duración aleatoria para el efecto fade in/out
        const fadeDuration = Math.random() * -15 + 37; // Duración fija de 37 segundos
        star.style.animationDuration = `${fadeDuration}s`;

        // Retraso aleatorio para que no todas aparezcan al mismo tiempo
        const delay = Math.random() * 10; // Hasta 10 segundos de retraso
        star.style.animationDelay = `${delay}s`;

        // Selección aleatoria de una animación de oscilación
        const oscillateClass = `oscillate${Math.floor(Math.random() * 3) + 1}`; // Elige entre oscillate1, oscillate2 y oscillate3
        star.style.animation += `, ${oscillateClass} 4s ease-in-out infinite`; // Añadir la animación de oscilación aleatoria

        // Evento para cambiar posición al final de la animación
        star.addEventListener('animationiteration', () => {
            setRandomPosition(star); // Cambiar la posición en cada iteración
        });

        discoBackground.appendChild(star);
    }
}

// Función para establecer una posición aleatoria
function setRandomPosition(star) {
    star.style.left = Math.random() * 30 + 'vw'; // Posición horizontal aleatoria

    let minVH = 10;
    let maxVH = 70;

    // Solo desktop (mouse real)
    if (window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches) {
        minVH = 50;
        maxVH = 150;
    }

    star.style.top = (Math.random() * (maxVH - minVH) + minVH) + 'vh';
}


document.addEventListener('DOMContentLoaded', generateTwinklingStars);



let originalHeight = window.innerHeight; // Guardamos la altura original

function fixBackground() {
    if (window.matchMedia("(max-width: 768px)").matches) {
        document.querySelector(".background-container").style.height = originalHeight * 2.25 + "px"; // 225vh en móviles
    } else {
        document.querySelector(".background-container").style.height = ""; // Restablece en escritorio
    }
}

window.addEventListener("resize", () => {
    setTimeout(() => {
        fixBackground();
    }, 100); // Pequeño delay para esperar el ajuste del teclado
});

window.addEventListener("load", fixBackground);


document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // 🔥 iOS AUTOPLAY FIX
  // =========================

  const bgVideoElements = document.querySelectorAll(".background-video");

  function tryPlayAll() {
    bgVideoElements.forEach(video => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    });
  }

  setTimeout(tryPlayAll, 800);

  let unlocked = false;

  function unlock() {
    if (unlocked) return;

    tryPlayAll();
    unlocked = true;

    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("click", unlock);
    window.removeEventListener("scroll", unlock);
  }

  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("click", unlock);
  window.addEventListener("scroll", unlock, { passive: true });



  // =========================
  // 🎬 BACKGROUND SWITCH
  // =========================

  const bgVideos = [
    {
      el: document.getElementById("bg-video-1"),
      src: "Copia de 0212 (17Belvnuevo).webm"
    },
    {
      el: document.getElementById("bg-video-2"),
      src: "Copia de Copia de Copia3 de 21Nov (3).webm"
    }
  ];

  let currentBgIndex = 0;

  function loadVideo(videoObj) {
    if (!videoObj.el.getAttribute("src")) { // 🔥 FIX real
      videoObj.el.src = videoObj.src;
      videoObj.el.load();
    }
  }

  function switchBackground() {

    const current = bgVideos[currentBgIndex];

    current.el.pause();
    current.el.removeAttribute("src");
    current.el.load();
    current.el.style.display = "none";

    currentBgIndex = (currentBgIndex + 1) % bgVideos.length;

    const next = bgVideos[currentBgIndex];

    loadVideo(next);

    next.el.style.display = "block";
    next.el.currentTime = 0;
    next.el.muted = true;
    next.el.playsInline = true;

    next.el.play().catch(() => {});
  }

  // 🔥 inicial
  loadVideo(bgVideos[0]);
  bgVideos[0].el.style.display = "block";
  bgVideos[0].el.play().catch(() => {});

  const btn = document.getElementById("bg-toggle-btn");
  if (btn) {
    btn.addEventListener("click", switchBackground);
  }

});

// Guardará el evento de instalación de la PWA
let deferredPrompt = null;

// Escuchar el evento que indica que la app puede instalarse
window.addEventListener('beforeinstallprompt', (event) => {
    // Evita que el navegador muestre automáticamente el diálogo
    event.preventDefault();

    // Guardar el evento para usarlo cuando el usuario haga clic en el botón
    deferredPrompt = event;

    // Mostrar el botón "Get the App"
    document.getElementById('install-app-btn').style.display = 'inline-block';
});

// Al hacer clic en el botón, mostrar el diálogo de instalación
document.getElementById('install-app-btn').addEventListener('click', async function () {
    // Si el navegador no permite instalación, no hacer nada
    if (!deferredPrompt) {
        alert('Installation is not available on this device or browser.');
        return;
    }

    // Mostrar el diálogo nativo de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
        console.log('User accepted the installation.');
    } else {
        console.log('User dismissed the installation.');
    }

    // El evento solo puede usarse una vez
    deferredPrompt = null;

    // Ocultar el botón después de usarlo
    document.getElementById('install-app-btn').style.display = 'none';
});

// Detectar cuando la app ya fue instalada
window.addEventListener('appinstalled', () => {
    console.log('The Amazing Jukebox was installed successfully.');

    // Ocultar el botón permanentemente
    document.getElementById('install-app-btn').style.display = 'none';

    deferredPrompt = null;
});



document.addEventListener("DOMContentLoaded", () => {
    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true; // soporte para iPhone

    if (isStandalone) {
        const installMenu = document.getElementById("get-the-app-link");
        if (installMenu) {
            installMenu.style.display = "none";
        }
    }
});




// ========================================================
// MINI-WIDGET CON ESTÉTICA "LIKED SONGS" (ORBITRON + NEÓN)
// ========================================================
(function() {
  if (!('documentPictureInPicture' in window)) return;

  let pipWindow = null;
  let trackCheckInterval = null;

  async function openMiniPlayer() {
    try {
      if (window.documentPictureInPicture.window) return;

      // 1. Abrir la ventana flotante en formato compacto
      pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 269,
        height: 163,
      });

      // 2. Inyectar la fuente Orbitron directamente en el head del widget flotante
      const fontLink = pipWindow.document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://googleapis.com';
      pipWindow.document.head.appendChild(fontLink);

      // 3. Inyectar la interfaz optimizada con tu imagen animada local
      // REEMPLAZA 'mi-rockola-animada.webp' POR TU RUTA REAL
      pipWindow.document.body.innerHTML = `
        <div class="mini-widget">
          <div class="widget-content">
            <!-- Animación exclusiva de la rocola -->
            <div class="album-art-container"> 
        <img id="mini-jukebox-animation" src="CopiadeCopiadeSinttulo3-ezgif.com-gif-to-webp-converter.webp" alt="Jukebox"> 
        </div>
            
            <div class="track-info">
              <p id="mini-track-title">🎶 LOADING...</p>
              <p id="mini-track-artist" class="artist-name">THE AMAZING JUKEBOX</p>
            </div>
          </div>
          
          <!-- CONTROLES INTERACTIVOS CON ESTILO CIAN -->
          <div class="widget-controls">
            <button id="mini-btn-play" class="w-btn btn-main">⏸</button>
            <button id="mini-btn-next" class="w-btn">⏭</button>
          </div>

          <!-- BARRA DE ESPECTRO SONORO HORIZONTAL (NUEVO ELEMENTO) -->
          <!-- Puedes mover este div entero más arriba o más abajo según tu diseño -->
          <div id="mini-spectrum" class="mini-audio-spectrum">
          <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
           
         
            
          </div>

          <div class="mini-footer">
            <p class="tagline"></p>
          </div>
        </div>
      `;

      // 4. Inyectar los estilos clonados EXACTAMENTE de tu #liked-songs-popup
      const style = pipWindow.document.createElement('style');
      style.textContent = `
        body {
          margin: 0; padding: 0; 
          background-color: #0b0d14; /* Tono oscuro a juego con tu paleta */
          font-family: 'Orbitron', monospace; 
          display: flex; justify-content: center; align-items: center; 
          cursor: url('neoncursor2.png'), auto;
          height: 100vh; overflow: hidden;
        }
                .mini-widget {
          width: 100%; 
          height: 100%; 
          padding: 14px; 
          box-sizing: border-box; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          align-items: center; 
          
          /* 1. Definimos un borde transparente del grosor que quieras (ej. 2px o 3px) */
          border: 2px solid transparent;
          border-radius: 24px; /* ¡Ahora el navegador SÍ respetará las esquinas! */

          /* 2. EL TRUCO MAESTRO: Doble fondo separado por comas */
          /* El primer fondo es tu color oscuro (recortado al contenido). El segundo es el degradado que actuará como borde */
          background-image: url("mini-footer9.svg"), 
                            linear-gradient(rgba(18, 22, 30, 0.90), rgba(18, 22, 30, 0.90)), 
                            linear-gradient(135deg, #d83ca4, #87ffff);
          
          /* Indicamos cómo se debe recortar cada capa de fondo */
          background-clip: padding-box, padding-box, border-box;
          background-origin: padding-box, padding-box, border-box;

          /* Configuración específica para tu SVG */
          background-repeat: no-repeat, no-repeat, no-repeat; 
          background-position: center, center, center; 
          background-size: contain, cover, cover; 

          /* Tus sombras de neón del pop-up Liked Songs */
          box-shadow: 0 12px 45px rgba(0,0,0,.45), 0 0 35px rgba(0,255,255,.18);
        }

        .widget-content {
          display: flex; width: 100%; align-items: center; gap: 16px; margin-top: -20px; margin-left: -10px;
        }
        .album-art-container img {
          width: 135px; height: 135px; border-radius: 39px;
          border: 0px solid #87ffff; /* Borde Cian Orbitron */
          box-shadow: 0 0 0px rgba(73, 255, 246, 0.2);
          object-fit: cover; background-color: transparent;
          
        }
        .track-info {
          display: flex; flex-direction: column; flex: 1; overflow: hidden; margin-left: 60px; margin-top: 65px;
        }
        #mini-track-title {
          color: #87ffff; /* Color de tu texto principal */
          font-size: 13px; font-weight: bold; margin: 0 0 4px 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          text-shadow: 0 0 8px rgba(73, 255, 246, 0.4);
          text-transform: uppercase; /* Vibe arcade retro */
        }
        .artist-name {
          color: #dffcff; /* Color secundario de tu pop-up */
          font-size: 10px; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          text-shadow: 0 0 6px rgba(73, 255, 246, 0.18);
          text-transform: uppercase;
        }
        .widget-controls {
          display: flex; justify-content: center; align-items: center; gap: 10px;
          width: 100%; margin-top: 0px; margin-left: 125px; margin-bottom: 40px;
        }
        
        /* ESTILO BURBUJA PARA TODOS LOS BOTONES */
       .w-btn {
          background: none; border: none; 
          color: #dffcff; /* Texto claro */
          font-size: 20px; cursor: pointer; transition: all 0.2s;
        }
        .w-btn:hover { 
          color: #87ffff; 
          text-shadow: 0 0 12px #87ffff; 
        }
        .btn-main { 
          font-size: 20px; 
          color: #87ffff; /* Destaca el Play/Pause en cian */
          width: 30px; 
        }
        .mini-footer { 
          width: 100%; 
          text-align: center; 
          margin-top: -29px; 
          z-index: 4;          
          padding-top: 5px;
        }
        
        .mini-footer .tagline {
          color: rgba(135, 255, 255, 0.3); /* Cian con opacidad */
          font-size: 9px; letter-spacing: 1.5px;
          margin: 0px 0 0 0;
          pointer-events: none;
          z-index: 2;
        }

                 /* Ajuste en el contenedor de la rocola animada */
        .album-art-container {
          width: 75px; 
  height: 75px; 
          position: relative; 
          
          
          /* TRUCO DEL CURSOR PERSONALIZADO */
          
          cursor: url('neoncursor4.png'), pointer; 
        }

        /* ESTILO PARA LA NOTA FLOTANTE */
        .floating-note {
          position: absolute;
          font-size: 30px;
          pointer-events: none; /* Evita que la nota interfiera con futuros clics */
          color: #87ffff;
          text-shadow: 0 0 8px rgba(73, 255, 246, 0.6);
          user-select: none;
          animation: floatUpAndFade 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* ANIMACIÓN DE FLOTADO Y DESVANECIMIENTO */
        @keyframes floatUpAndFade {
          0% {
            transform: translate(-50%, -50%) scale(0.5) translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            /* Flota hacia arriba 40 píxeles, se agranda un poco y gira a su ángulo aleatorio */
            transform: translate(-50%, -50%) scale(1.2) translateY(-40px) rotate(var(--rotation, 20deg));
            opacity: 0;
          }
        }

                /* CONTENEDOR DEL ESPECTRO SONORO */
        .mini-audio-spectrum {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 3px;
          
          margin: 0px 0 75px 85px;
          width: 100%;
          transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1), 
                      opacity 2s ease, 
                      height 2s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom;

          background-image: linear-gradient(to top, #87ffff 20%, #d83ca4 100%);
          background-size: 100% 28px;
          background-repeat: no-repeat;
          background-position: bottom;
          
          /* Opcional: Un resplandor combinado de fondo */
          filter: drop-shadow(0 0 4px rgba(73, 255, 246, 0.3));
          
        }

        /* DISEÑO DE LAS BARRITAS INDIVIDUALES */
        .mini-audio-spectrum span {
          display: block;
          width: 4px;
          height: 3px; /* Altura en estado quieto (mínima) */
           background: inherit;
          background-attachment: fixed;
          
          /* Agrega un brillo general sutil */
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
          border-radius: 1px;
          margin-top: -85px;
          
          animation: bounceSpectrum 1.2s ease infinite alternate;
          animation-play-state: paused; /* Inicia pausada por defecto */
          
        }

        /* CUANDO LA MÚSICA ESTÁ SONANDO (PLAY) */
        .mini-audio-spectrum.animation-active {
          transform: scaleY(1);
          opacity: 1;
          height: 18px;
        }
        .mini-audio-spectrum.animation-active span {
          animation-play-state: running; /* Encendemos el motor de la animación */
        }

        /* ESTADO DE PAUSA SUAVE (Cuando NO tiene la clase .animation-active) */
        /* Al quitar la clase, el contenedor se encoge suavemente aplastando las barras hacia el suelo */
        .mini-audio-spectrum:not(.animation-active) {
          transform: scaleY(0.15); /* Encoge las barras verticalmente hasta el mínimo */
          opacity: 0.5; /* Atenuamos el neón un poco más (50%) para dar sensación de 'apagado' */
        }

                /* DISPOSICIÓN ASIMÉTRICA EN PIRÁMIDE (48 BARRITAS) */
    
        .mini-audio-spectrum span:nth-child(1) { animation-delay: 0.2s; animation-duration: 1.8s; --max-h: 4px; }
        
        .mini-audio-spectrum span:nth-child(2) { animation-delay: 0.1s; animation-duration: 1.6s; --max-h: 7px; }
    
        .mini-audio-spectrum span:nth-child(3) { animation-delay: 0.7s; animation-duration: 1.9s; --max-h: 8px; }
        
    
        .mini-audio-spectrum span:nth-child(4) { animation-delay: 0.4s; animation-duration: 2.3s; --max-h: 9px; }
        
        .mini-audio-spectrum span:nth-child(5) { animation-delay: 0.5s; animation-duration: 2.6s; --max-h: 20px; }
       
        .mini-audio-spectrum span:nth-child(6) { animation-delay: 0.6s; animation-duration: 1.8s; --max-h: 16px; }
  
        .mini-audio-spectrum span:nth-child(7) { animation-delay: 0.2s; animation-duration: 1.9s; --max-h: 14px; }
  
        .mini-audio-spectrum span:nth-child(8) { animation-delay: 0.1s; animation-duration: 1.6s; --max-h: 23px; }
       
        .mini-audio-spectrum span:nth-child(9) { animation-delay: 0.3s; animation-duration: 2.5s; --max-h: 18px; }
        .mini-audio-spectrum span:nth-child(10) { animation-delay: 0.6s; animation-duration: 1.8s; --max-h: 25px; }
    
        .mini-audio-spectrum span:nth-child(11) { animation-delay: 0.7s; animation-duration: 2.0s; --max-h: 26px; }
        
  
        .mini-audio-spectrum span:nth-child(12) { animation-delay: 0.1s; animation-duration: 1.7s; --max-h: 28px; }
       
      
        .mini-audio-spectrum span:nth-child(13) { animation-delay: 0.6s; animation-duration: 2.3s; --max-h: 28px; }
        

        .mini-audio-spectrum span:nth-child(14) { animation-delay: 0.2s; animation-duration: 2.1s; --max-h: 26px; }
       
        .mini-audio-spectrum span:nth-child(15) { animation-delay: 0.7s; animation-duration: 2.5s; --max-h: 18px; }
      
        .mini-audio-spectrum span:nth-child(16) { animation-delay: 0.5s; animation-duration: 1.6s; --max-h: 24px; }

        .mini-audio-spectrum span:nth-child(17) { animation-delay: 0.2s; animation-duration: 1.9s; --max-h: 14px; }
        .mini-audio-spectrum span:nth-child(18) { animation-delay: 0.4s; animation-duration: 2.4s; --max-h: 22px; }
        
        .mini-audio-spectrum span:nth-child(19) { animation-delay: 0.5s; animation-duration: 2.1s; --max-h: 16px; }
    
        .mini-audio-spectrum span:nth-child(20) { animation-delay: 0.6s; animation-duration: 2.6s; --max-h: 20px; }
    
        .mini-audio-spectrum span:nth-child(21) { animation-delay: 0.7s; animation-duration: 2.3s; --max-h: 9px; }
        
       
        .mini-audio-spectrum span:nth-child(22) { animation-delay: 0.1s; animation-duration: 1.9s; --max-h: 8px; }

        .mini-audio-spectrum span:nth-child(23) { animation-delay: 0.6s; animation-duration: 2.1s; --max-h: 7px; }
      
        .mini-audio-spectrum span:nth-child(24) { animation-delay: 0.4s; animation-duration: 2.4s; --max-h: 4px; }


        /* ANIMACIÓN DE SUBIDA Y BAJADA */
        @keyframes bounceSpectrum {
          0% { height: 3px; }
          100% { height: var(--max-h, 18px); } /* Lee el valor '--max-h' de arriba */
        }
      `;
      pipWindow.document.head.appendChild(style);

      // 5. FUNCIÓN PARA SINCRONIZAR TEXTOS Y ESTADO DE PLAY
      function syncWidgetData() {
        const activePlayer = window.ytPlayer || ytPlayer;
        
        if (typeof videos !== 'undefined' && typeof currentVideoIndex !== 'undefined' && currentVideoIndex >= 0) {
          const currentSongObj = videos[currentVideoIndex];
          const currentSongKey = currentSongObj.key || currentSongObj.src;
          
          if (typeof songInfo !== 'undefined' && songInfo[currentSongKey]) {
            const track = songInfo[currentSongKey];
            
            const titleEl = pipWindow.document.getElementById('mini-track-title');
            const artistEl = pipWindow.document.getElementById('mini-track-artist');
            
            // Forzamos mayúsculas para encajar con el estilo Orbitron clásico
            if (titleEl && titleEl.innerText !== track.name.toUpperCase()) {
              titleEl.innerText = track.name.toUpperCase();
            }
            if (artistEl && artistEl.innerText !== track.artist.toUpperCase()) {
              artistEl.innerText = (track.artist || "UNKNOWN ARTIST").toUpperCase();
            }
          }
        }

        // Sincronizar el estado visual del botón Play/Pause
        const playBtn = pipWindow.document.getElementById('mini-btn-play');
        const spectrumEl = pipWindow.document.getElementById('mini-spectrum');
        if (playBtn && activePlayer && typeof activePlayer.getPlayerState === 'function') {
          const state = activePlayer.getPlayerState();
          if (state === 1 || state === 3) {
            playBtn.innerHTML = "&#9208;"; // ⏸
              if (spectrumEl) spectrumEl.classList.add('animation-active');
          } else {
            playBtn.innerHTML = "&#9654;"; // ▶
              if (spectrumEl) spectrumEl.classList.remove('animation-active');
          }
        }
      }

      // Ejecutamos la sincronización inicial y el bucle cada medio segundo
      syncWidgetData();
      trackCheckInterval = setInterval(syncWidgetData, 500);

        

      // ========================================================
      // EFECTO VISUAL: NOTAS MUSICALES AL DAR CLIC EN LA ROCOLA
      // ========================================================
      const jukeboxImg = pipWindow.document.getElementById('mini-jukebox-animation');
      
      if (jukeboxImg) {
        jukeboxImg.addEventListener('click', (e) => {
          // Arreglo con los emojis que pueden salir al hacer clic
          const particles = ["🎵", "🎶", "✨", "🎸", "🎹", "✨", "🎷", "🔥", "✨"];
          const randomParticle = particles[Math.floor(Math.random() * particles.length)];
          
          // Crear el elemento flotante
          const note = pipWindow.document.createElement('span');
          note.className = 'floating-note';
          note.innerText = randomParticle;
          
          // Calcular la posición relativa del clic dentro de la imagen
          const rect = jukeboxImg.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Posicionar la nota
          note.style.left = `${x}px`;
          note.style.top = `${y}px`;
          
          // Un ángulo de rotación aleatorio para que se vea más orgánico
          const randomRotation = Math.floor(Math.random() * 60) - 30; // Entre -30 y 30 grados
          note.style.setProperty('--rotation', `${randomRotation}deg`);
          
          // Meter la nota dentro del contenedor de la imagen
          const container = pipWindow.document.querySelector('.album-art-container');
          if (container) {
            container.appendChild(note);
            
            // Eliminar la nota del DOM después de 1 segundo (cuando termina la animación CSS)
            setTimeout(() => {
              note.remove();
            }, 1000);
          }
        });
      }

        

      // 6. CONEXIÓN DE BOTONES INTERACTIVOS
      pipWindow.document.getElementById('mini-btn-next').addEventListener('click', () => {
        if (typeof playNextVideo === 'function') {
          playNextVideo();
          setTimeout(syncWidgetData, 300);
        }
      });

      pipWindow.document.getElementById('mini-btn-play').addEventListener('click', () => {
        const activePlayer = window.ytPlayer || ytPlayer;
        const playBtn = pipWindow.document.getElementById('mini-btn-play');
        const spectrumEl = pipWindow.document.getElementById('mini-spectrum');
        
        if (activePlayer && typeof activePlayer.getPlayerState === 'function') {
          const state = activePlayer.getPlayerState();
          if (state === 1) {
            activePlayer.pauseVideo();
            if (playBtn) playBtn.innerHTML = "&#9654;";
              if (spectrumEl) spectrumEl.classList.remove('animation-active');
          } else {
            activePlayer.playVideo();
            if (playBtn) playBtn.innerHTML = "&#9208;";
              if (spectrumEl) spectrumEl.classList.add('animation-active');
          }
        }
      });

      // 7. Limpieza al cerrar
      pipWindow.addEventListener('pagehide', () => {
        if (trackCheckInterval) clearInterval(trackCheckInterval);
        pipWindow = null;
      });

    } catch (error) {
      console.error("Error al abrir el mini-widget:", error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const myPipBtn = document.getElementById('pip-button');
    if (myPipBtn) {
      myPipBtn.addEventListener('click', openMiniPlayer);
    }
  });

        // ========================================================
  // NOTIFICACIÓN INTELIGENTE DE MINI-PLAYER (ESTILO WEB)
  // ========================================================
  document.addEventListener('visibilitychange', () => {
    // Si el usuario cambia de pestaña y luego REGRESA a la rocola
    if (document.visibilityState === 'visible') {
      
      // Validamos si la música está sonando y el mini-player no está abierto
      if (!pipWindow || pipWindow.closed) {
        const activePlayer = window.ytPlayer || ytPlayer;
        if (activePlayer && typeof activePlayer.getPlayerState === 'function') {
          const state = activePlayer.getPlayerState();
          
          if (state === 1 || state === 3) {
            showMiniPlayerBanner();
          }
        }
      }
    }
  });

  function showMiniPlayerBanner() {
    // Si el banner ya existe en la pantalla, no hacemos nada
    if (document.getElementById('pip-smart-banner')) return;

    // Crear el contenedor del banner flotante
    const banner = document.createElement('div');
    banner.id = 'pip-smart-banner';
    
    // Inyectar el diseño con la misma estética Orbitron/Neón de tu web
    banner.innerHTML = `
      <div class="banner-body">
        <span class="banner-icon">🔮</span>
        <div class="banner-text">
          <p class="banner-title">MINI-PLAYER AVAILABLE</p>
          <p class="banner-desc">Keep using the reproduction controls while browsing other tabs.</p>
        </div>
        <button id="banner-btn-accept" class="b-btn b-accept">LAUNCH</button>
        <button id="banner-btn-close" class="b-btn b-close">✕</button>
      </div>
    `;

    // Estilos de neón incrustados para que luzca espectacular en tu esquina inferior derecha
    const style = document.createElement('style');
    style.id = 'pip-banner-styles';
    style.textContent = `
      #pip-smart-banner {
        position: fixed; bottom: 25px; right: 25px; z-index: 10000;
        background-color: rgba(18, 22, 30, 0.9); backdrop-filter: blur(10px);
        border: 2px solid #d83ca4; border-radius: 16px; padding: 12px 18px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(135,255,255,0.15);
        font-family: 'Orbitron', monospace; width: 320px;
        animation: slideInBanner 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      @keyframes slideInBanner {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .banner-body { display: flex; align-items: center; gap: 12px; position: relative; }
      .banner-icon { font-size: 22px; }
      .banner-text { flex: 1; display: flex; flex-direction: column; }
      .banner-title { color: #87ffff; font-size: 11px; font-weight: bold; margin: 0 0 2px 0; letter-spacing: 0.5px; }
      .banner-desc { color: #dffcff; font-size: 9px; margin: 0; line-height: 1.2; font-family: sans-serif; }
      .b-btn { border: none; background: none; cursor: pointer; font-family: 'Orbitron', monospace; }
      .b-accept { background-color: #d83ca4; color: #fff; font-size: 10px; font-weight: bold; padding: 6px 12px; border-radius: 8px; box-shadow: 0 0 8px rgba(216,60,164,0.4); transition: all 0.2s; }
      .b-accept:hover { background-color: #ff52c5; box-shadow: 0 0 12px #ff52c5; }
      .b-close { color: #4a4370; font-size: 14px; padding: 0 4px; }
      .b-close:hover { color: #d83ca4; }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Evento para lanzar el reproductor al dar clic (Aceptado por el navegador por ser un clic real)
    document.getElementById('banner-btn-accept').addEventListener('click', () => {
      openMiniPlayer();
      dismissBanner();
    });

    // Evento para cerrar el banner
    document.getElementById('banner-btn-close').addEventListener('click', dismissBanner);
  }

  function dismissBanner() {
    const banner = document.getElementById('pip-smart-banner');
    const styles = document.getElementById('pip-banner-styles');
    if (banner) banner.remove();
    if (styles) styles.remove();
  }


    const preloadJukeboxAnim = new Image(); 
    preloadJukeboxAnim.src = 'CopiadeCopiadeSinttulo3-ezgif.com-gif-to-webp-converter.webp'; 

    // 2. Precarga de tu cursor personalizado (Se queda igual porque es imagen)
  const preloadJukeboxCursor = new Image();
  preloadJukeboxCursor.src = 'neoncursor4.png';

    const preloadJukeboxBgSvg = new Image();
  preloadJukeboxBgSvg.src = 'mini-footer9.svg';

    
})();

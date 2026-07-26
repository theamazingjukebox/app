/* ==========================================
   THE AMAZING JUKEBOX
   Push Invitation Component v1.0
   Integrated with OneSignal SDK v16
========================================== */

const PushInvitation = {

    // --- CONFIGURACIÓN DE PRUEBAS ---
    // Cambia a 'false' cuando ya tengas el script de OneSignal cargado en tu HTML
    modoPruebaOneSignal: false, 

    scheduled: false,
    delay: 15000, // 15 segundos exactos desde el PLAY del video

    init() {
        this.overlay = document.getElementById("push-overlay");
        this.enableBtn = document.querySelector(".push-enable");
        this.laterBtn = document.querySelector(".push-later");
        this.noBtn = document.querySelector(".push-no");
        this.icon = document.querySelector(".push-icon");
        this.title = document.querySelector(".push-title");
        this.text = document.querySelector(".push-text");

        if (!this.overlay) return;

        // Esperamos a que YouTube mande llamar al método schedule() en el evento Play
       if (this.wasAnswered()) return;

               // --- EVENTO: ACEPTAR (CONEXIÓN ONESIGNAL CORREGIDA) ---
        this.enableBtn.addEventListener("click", () => {
            // Si estamos en modo de prueba local, simulamos una aceptación inmediata
            if (this.modoPruebaOneSignal) {
                console.log("[Prueba] Simulando aceptación de OneSignal...");
                localStorage.setItem("taj_push_accepted", Date.now());
                this.showResponse(
                    "💎", 
                    "You're all set!", 
                    "You'll now receive occasional notifications whenever a new gem joins The Amazing Jukebox.\n\nEnjoy the music! 🎵"
                );
                return;
            }

            // --- FLUJO REAL DE ONESIGNAL ---
            if (typeof window.OneSignal !== "undefined") {
                
                // Levantamos la solicitud del navegador
                window.OneSignal.Notifications.requestPermission().then(() => {
                    
                    // CORRECCIÓN: Le preguntamos al SDK el estado real e inmediato del permiso actual
                    const tienePermiso = window.OneSignal.Notifications.permission;
                    
                    // El navegador devuelve true si el usuario aceptó en esta ocasión o si ya estaba aceptado
                    if (tienePermiso === true || tienePermiso === "granted") {
                        
                        // Ahora SÍ guardamos de forma segura el registro en tu LocalStorage
                        localStorage.setItem("taj_push_accepted", Date.now());
                        console.log("Notificaciones activadas con éxito en OneSignal y registrado en LocalStorage.");

                        // Mostramos la tarjeta de éxito con el diamante
                        this.showResponse(
                            "💎", 
                            "You're all set!", 
                            "You'll now receive occasional notifications whenever a new gem joins The Amazing Jukebox.\n\nEnjoy the music! 🎵"
                        );
                    } else {
                        // El usuario le dio a "Bloquear" o cerró la ventana emergente gris
                        console.log("El usuario no concedió el permiso.");
                        this.hide();
                        this.resetCard();
                    }
                }).catch((error) => {
                    console.error("Error al solicitar permisos con OneSignal:", error);
                    this.hide();
                    this.resetCard();
                });

            } else {
                console.warn("El SDK de OneSignal no se ha cargado en el documento.");
                this.hide();
                this.resetCard();
            }
        });


        // --- EVENTO: MÁS TARDE ---
        this.laterBtn.addEventListener("click", () => {
            localStorage.setItem("taj_push_later", Date.now());

            this.showResponse(
                "⏰",
                "No problem.",
                "We'll remind you again in about 7 days.\n\nEnjoy the music! 🎵"
            );
        });

        // --- EVENTO: DECLINAR ---
        this.noBtn.addEventListener("click", () => {
            localStorage.setItem("taj_push_declined", Date.now()); 

            this.showResponse(
                "❤️",
                "No problem.",
                "We won't ask again.\n\nYou can always enable notifications later from Settings.\n\nEnjoy the music! 🎵"
            );
        });
    },

    schedule() {
        if (this.scheduled) return;
        this.scheduled = true;

        setTimeout(() => {
            if (document.visibilityState !== "visible") return;
            this.show();
        }, this.delay);
    },

     show() {
        if (!this.overlay) return;
        
        // Primero forzamos que inicie en fade (transparente)
        this.overlay.classList.add("fade");
        // Activamos la visibilidad usando la clase CSS blindada
        this.overlay.classList.add("is-visible");
        
        // Pequeño respiro controlado para activar la transición de opacidad
        setTimeout(() => {
            this.overlay.classList.remove("fade");
        }, 30);
    },

    hide() {
        if (!this.overlay) return;
        this.overlay.classList.remove("is-visible");
    },

    // Corregido: Ahora revisa activamente el LocalStorage
    wasAnswered() {
       
        const accepted = localStorage.getItem("taj_push_accepted");
        const declined = localStorage.getItem("taj_push_declined");
        const later = localStorage.getItem("taj_push_later");

        // Si ya aceptó o declinó permanentemente, no se muestra
        if (accepted || declined) return true;

        // Si pidió "Más tarde", verificar si ya pasaron 7 días (7 * 24 * 60 * 60 * 1000 ms)
        if (later) {
            const sieteDias = 7 * 24 * 60 * 60 * 1000;
            const tiempoTranscurrido = Date.now() - parseInt(later);
            if (tiempoTranscurrido < sieteDias) {
                return true; // Aún no pasa el tiempo, no mostrar
            }
        }

        return false;
    },

     resetCard(){
        

        // Volvemos a colocar el contenido original
        this.icon.innerHTML = '<img src="push-logo.webp" alt="">';
        this.title.textContent = "Never miss a new gem";
        this.text.textContent = "Receive an occasional notification whenever a carefully curated song joins The Amazing Jukebox.";

        // Restauramos los botones
        this.enableBtn.style.display = "";
        this.laterBtn.style.display = "";
        this.noBtn.style.display = "";

        this.overlay.classList.remove("fade");
    },

      showResponse(icon, title, message){
        // 1. Desvanecemos la tarjeta de pregunta hacia afuera
        this.overlay.classList.add("fade");

        // 2. Cambiamos el contenido a los 300ms (cuando ya no se ve)
        setTimeout(() => {
            this.icon.innerHTML = icon;
            this.title.textContent = title;
            this.text.textContent = message;

            this.enableBtn.style.display = "none";
            this.laterBtn.style.display = "none";
            this.noBtn.style.display = "none";

            // Volvemos a desvanecer hacia adentro para revelar la respuesta
            this.overlay.classList.remove("fade");
        }, 300);

        // 3. Esperamos los 7 segundos para que el usuario lea el agradecimiento/aviso
        setTimeout(() => {
            // Desvanecemos la respuesta hacia afuera
            this.overlay.classList.add("fade");

            setTimeout(() => {
                // Removemos la clase de visibilidad por completo
                this.hide();
                // Reseteamos los elementos de forma segura
                this.resetCard();
            }, 300);

        }, 9000);
    },

   
    isStandalone() {
        return (
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true
        );
    }
};

document.addEventListener("DOMContentLoaded", () => {
    PushInvitation.init();
});


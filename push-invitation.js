/* ==========================================
   THE AMAZING JUKEBOX
   Push Invitation Component v1.0
   Integrated with OneSignal SDK v16 - Patched
========================================== */

const PushInvitation = {

    modoPruebaOneSignal: false, 
    scheduled: false,
    delay: 15000, 

    init() {
        this.overlay = document.getElementById("push-overlay");
        this.enableBtn = document.querySelector(".push-enable");
        this.laterBtn = document.querySelector(".push-later");
        this.noBtn = document.querySelector(".push-no");
        this.icon = document.querySelector(".push-icon");
        this.title = document.querySelector(".push-title");
        this.text = document.querySelector(".push-text");

        if (!this.overlay) return;

        // --- CORRECCIÓN EXTRA: VALIDACIÓN AUTOMÁTICA EN NUEVAS PESTAÑAS ---
        // Si el usuario ya aceptó nativamente las notificaciones en OneSignal,
        // guardamos el registro de inmediato para que no vuelva a saltar jamás.
        if (typeof window.OneSignal !== "undefined") {
            const tienePermiso = window.OneSignal.Notifications.permission;
            if (tienePermiso === true || tienePermiso === "granted") {
                localStorage.setItem("taj_push_accepted", Date.now());
            }
        }

        // --- EVENTO: ACEPTAR (CONEXIÓN ONESIGNAL) ---
        this.enableBtn.addEventListener("click", () => {
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

            if (typeof window.OneSignal !== "undefined") {
                window.OneSignal.Notifications.requestPermission().then(() => {
                    const tienePermiso = window.OneSignal.Notifications.permission;
                    if (tienePermiso === true || tienePermiso === "granted") {
                        localStorage.setItem("taj_push_accepted", Date.now());
                        console.log("Notificaciones activadas con éxito en OneSignal.");
                        this.showResponse(
                            "💎", 
                            "You're all set!", 
                            "You'll now receive occasional notifications whenever a new gem joins The Amazing Jukebox.\n\nEnjoy the music! 🎵"
                        );
                    } else {
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
        // CORRECCIÓN CLAVE: Validar activamente si ya fue respondido ANTES de encender el reloj
        if (this.wasAnswered()) return; 
        
        if (this.scheduled) return;
        this.scheduled = true;

        setTimeout(() => {
            if (document.visibilityState !== "visible") return;
            this.show();
        }, this.delay);
    },

   // ==========================
// APERTURA MANUAL
// ==========================

open() {
    this.resetCard();
    this.show();
},
   

    show() {
        if (!this.overlay) return;
        this.overlay.classList.add("fade");
        this.overlay.classList.add("is-visible");
        
        setTimeout(() => {
            this.overlay.classList.remove("fade");
        }, 30);
    },

    hide() {
        if (!this.overlay) return;
        this.overlay.classList.remove("is-visible");
    },

    wasAnswered() {
       
        const accepted = localStorage.getItem("taj_push_accepted");
        const declined = localStorage.getItem("taj_push_declined");
        const later = localStorage.getItem("taj_push_later");

        if (accepted || declined) return true;

        if (later) {
            const sieteDias = 7 * 24 * 60 * 60 * 1000;
            const tiempoTranscurrido = Date.now() - parseInt(later);
            if (tiempoTranscurrido < sieteDias) {
                return true; 
            }
        }
        return false;
    },

    resetCard(){
        this.icon.innerHTML = '<img src="alerts-logo.png" alt="">';
        this.title.textContent = "Never miss a new gem";
        this.text.textContent = "Receive an occasional notification whenever a carefully curated song joins The Amazing Jukebox.";
        this.enableBtn.style.display = "";
        this.laterBtn.style.display = "";
        this.noBtn.style.display = "";
        this.overlay.classList.remove("fade");
    },

    showResponse(icon, title, message){
        this.overlay.classList.add("fade");
        setTimeout(() => {
            this.icon.innerHTML = icon;
            this.title.textContent = title;
            this.text.textContent = message;
            this.enableBtn.style.display = "none";
            this.laterBtn.style.display = "none";
            this.noBtn.style.display = "none";
            this.overlay.classList.remove("fade");
        }, 300);

        setTimeout(() => {
            this.overlay.classList.add("fade");
            setTimeout(() => {
                this.hide();
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
   
  const notificationsButton =
        document.getElementById("notifications-button");

    if (notificationsButton) {

        notificationsButton.addEventListener("click", () => {

            PushInvitation.open();

        });
    }

});


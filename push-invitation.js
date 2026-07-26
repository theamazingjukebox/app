/* ==========================================
   THE AMAZING JUKEBOX
   Push Invitation Component v1.0
========================================== */

const PushInvitation = {

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

        // Si ya fue respondido o pospuesto recientemente, no hacemos nada
        if (this.wasAnswered()) return;
       

        // --- EVENTO: ACEPTAR ---
        this.enableBtn.addEventListener("click", () => {
            // Guardamos que ya aceptó para que no vuelva a saltar
            localStorage.setItem("taj_push_accepted", Date.now());

            // ← Aquí conectarás OneSignal en el futuro
            console.log("Enable Push con OneSignal");

            this.showResponse(
                "💎",
                "You're all set!",
                "You'll now receive occasional notifications whenever a new gem joins The Amazing Jukebox.\n\nEnjoy the music! 🎵"
            );
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
       return false; 
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

        }, 7000);
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


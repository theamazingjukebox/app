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

        // Iniciar el temporizador para mostrar la invitación
        this.schedule();

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
        this.overlay.style.display = "flex";
    },

    hide() {
        if (!this.overlay) return;
        this.overlay.style.display = "none";
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
        // Quitamos la clase de transparencia para que sea visible
        this.overlay.classList.remove("fade");

        // Volvemos a colocar el contenido original
        this.icon.innerHTML = '<img src="push-logo.webp" alt="">';
        this.title.textContent = "Never miss a new gem";
        this.text.textContent = "Receive an occasional notification whenever a carefully curated song joins The Amazing Jukebox.";

        // Restauramos los botones
        this.enableBtn.style.display = "";
        this.laterBtn.style.display = "";
        this.noBtn.style.display = "";
    },

    showResponse(icon, title, message){
        // 1. Añadimos la clase para desvanecer el contenido de la tarjeta
        this.overlay.classList.add("fade");

        // 2. Esperamos a que termine de ocultarse (300ms) para cambiar el texto de forma invisible
        setTimeout(() => {
            this.icon.innerHTML = icon;
            this.title.textContent = title;
            this.text.textContent = message;

            // Ocultamos los botones
            this.enableBtn.style.display = "none";
            this.laterBtn.style.display = "none";
            this.noBtn.style.display = "none";

            // 3. Volvemos a mostrar la tarjeta de forma suave con el nuevo texto
            this.overlay.classList.remove("fade");
        }, 300);

        // Espera los 7 segundos acordados antes de cerrar todo por completo
        setTimeout(() => {
            // Desvanecemos antes de cerrar
            this.overlay.classList.add("fade");
            
            setTimeout(() => {
                this.hide();
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


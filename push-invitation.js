/* ==========================================
   THE AMAZING JUKEBOX
   Push Invitation Component v2.0
========================================== */

const PushInvitation = {

    scheduled: false,

    delay: 15000,

    init() {

        this.overlay = document.getElementById("push-overlay");
        this.enableBtn = document.querySelector(".push-enable");
        this.laterBtn = document.querySelector(".push-later");

        this.icon = document.querySelector(".push-icon");
        this.title = document.querySelector(".push-title");
        this.text = document.querySelector(".push-text");

        if (!this.overlay) return;

        this.enableBtn.addEventListener("click", async () => {

            console.log("Antes:", Notification.permission);

            try {

                // Si ya existe permiso simplemente mostramos la confirmación.
                if (Notification.permission === "granted") {

                    this.showSuccess();

                    return;

                }

                await OneSignal.Notifications.requestPermission();

                console.log("Después:", Notification.permission);

                if (Notification.permission === "granted") {

                    this.showSuccess();

                }

            } catch (err) {

                console.error(err);

            }

        });

        this.laterBtn.addEventListener("click", () => {

            this.hide();

            localStorage.setItem(
                "taj_push_later",
                Date.now()
            );

        });

    },

    schedule() {

        if (this.scheduled) return;

        if (!this.isStandalone()) return;

        if (this.wasAnswered()) return;

        this.scheduled = true;

        setTimeout(() => {

            if (document.visibilityState !== "visible") return;

            this.show();

        }, this.delay);

    },

    show() {

        this.overlay.style.display = "flex";

    },

    hide() {

        this.overlay.style.display = "none";

    },

    showSuccess() {

        this.icon.innerHTML = "💎";

        this.title.innerHTML = "You're all set!";

        this.text.innerHTML =
            "You'll now receive occasional notifications whenever a new musical gem joins The Amazing Jukebox.";

        this.enableBtn.style.display = "none";
        this.laterBtn.style.display = "none";

        setTimeout(() => {

            this.hide();

        }, 2500);

    },

    wasAnswered() {

        /*
           Solo respetamos "Maybe Later".

           NO usamos Notification.permission para decidir
           si mostrar nuestra tarjeta.

           La tarjeta pertenece al Jukebox.

           El permiso pertenece al navegador.
        */

        const later = localStorage.getItem("taj_push_later");

        if (!later)
            return false;

        const days = 7;

        return (Date.now() - Number(later))
            < days * 24 * 60 * 60 * 1000;

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

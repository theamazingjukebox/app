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

        if (!this.overlay) return;

        this.enableBtn.addEventListener("click", () => {

            this.hide();

            // ← Aquí conectaremos OneSignal
            console.log("Enable Push");

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

    console.log("schedule()");

    console.log("Standalone:", this.isStandalone());

    console.log("Permission:", Notification.permission);

    console.log("Answered:", this.wasAnswered());

    this.show();

}

    show() {

        if (!this.overlay) return;

        this.overlay.style.display = "flex";

    },

    hide() {

        if (!this.overlay) return;

        this.overlay.style.display = "none";

    },

    wasAnswered() {

    return false;

}

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

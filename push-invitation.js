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

       this.noBtn.addEventListener("click", () => {

           this.hide();

           localStorage.setItem(
             "taj_push_declined",
                Date.now()
          );

        
       this.enableBtn.addEventListener(()=>{

    this.showResponse(

        "💎",

        "Thanks!",

        "You'll now receive occasional notifications whenever a carefully curated song joins The Amazing Jukebox.\n\nEnjoy the music! 🎵"

    );

});
       this.laterBtn.addEventListener(()=>{

    localStorage.setItem(
        "taj_push_later",
        Date.now()
    );

    this.showResponse(

        "⏰",

        "No problem.",

        "We'll remind you again in about 7 days.\n\nEnjoy the music! 🎵"

    );

});
       this.noBtn.addEventListener(()=>{

    localStorage.setItem(
        "taj_push_declined",
        Date.now()
    );

    this.showResponse(

        "❤️",

        "No problem.",

        "We won't ask again.\n\nYou can always enable notifications later from Settings.\n\nEnjoy the music! 🎵"

    );

});

    },

    schedule() {

    if (this.scheduled) return;

    if (this.wasAnswered()) return;

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

    wasAnswered() {

    return false;

},


resetCard(){

    this.icon.innerHTML =
        '<img src="push-logo.webp" alt="">';

    this.title.textContent =
        "Never miss a new gem";

    this.text.textContent =
        "Receive an occasional notification whenever a carefully curated song joins The Amazing Jukebox.";

    this.enableBtn.style.display = "";

    this.laterBtn.style.display = "";

    this.noBtn.style.display = "";

},

showResponse(icon,title,message){

    this.icon.innerHTML = icon;

    this.title.textContent = title;

    this.text.textContent = message;

    this.enableBtn.style.display = "none";

    this.laterBtn.style.display = "none";

    this.noBtn.style.display = "none";

    setTimeout(()=>{

        this.hide();

        this.resetCard();

    },7000);

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

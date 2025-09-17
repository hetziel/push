const notifyBtn = document.getElementById('notify-btn');

notifyBtn.addEventListener('click', () => {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        new Notification("Hi old there!");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification("Hi new there!");
            }
        });
    }
});
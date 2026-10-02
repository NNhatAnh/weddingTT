const weddingDate = new Date("Oct 18, 2026 09:00:00").getTime();

const timer = setInterval(function () {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML =
            "<div class='col-span-4 text-xl text-amber-200 font-bold'>Đám cưới đã diễn ra!</div>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText =
        hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText =
        minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText =
        seconds < 10 ? "0" + seconds : seconds;
}, 1000);

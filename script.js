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

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("wedding-audio");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playIcon = document.getElementById("play-icon");
    const playlistSelect = document.getElementById("playlist-select");
    const currentSongTitle = document.getElementById("current-song-title");
    const progress = document.getElementById("music-progress");
    const currentTimeEl = document.getElementById("current-time");
    const totalDurationEl = document.getElementById("total-duration");
    const loopBtn = document.getElementById("loop-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const muteBtn = document.getElementById("mute-btn");
    const volumeIcon = document.getElementById("volume-icon");

    let isPlaying = false;

    function loadSong() {
        const selectedOption =
            playlistSelect.options[playlistSelect.selectedIndex];
        audio.src = playlistSelect.value;
        currentSongTitle.innerText = selectedOption.text;
    }

    function updateUIPlay() {
        isPlaying = true;
        playIcon.classList.remove("fa-play", "ml-0.5");
        playIcon.classList.add("fa-pause");
    }

    function updateUIPause() {
        isPlaying = false;
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play", "ml-0.5");
    }

    function playAudio() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    updateUIPlay();
                })
                .catch((error) => {
                    console.log(
                        "Trình duyệt chặn autoplay, chờ người dùng tương tác:",
                        error,
                    );
                    updateUIPause();
                    enableAutoplayOnUserInteraction();
                });
        }
    }

    function pauseAudio() {
        audio.pause();
        updateUIPause();
    }

    function enableAutoplayOnUserInteraction() {
        const handleInteraction = () => {
            if (!isPlaying) {
                playAudio();
            }

            ["click", "touchstart", "scroll", "keydown"].forEach((event) => {
                document.removeEventListener(event, handleInteraction);
            });
        };

        ["click", "touchstart", "scroll", "keydown"].forEach((event) => {
            document.addEventListener(event, handleInteraction, { once: true });
        });
    }

    playPauseBtn.addEventListener("click", function () {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    playlistSelect.addEventListener("change", function () {
        loadSong();
        playAudio();
    });

    prevBtn.addEventListener("click", function () {
        let currentIndex = playlistSelect.selectedIndex;
        currentIndex =
            (currentIndex - 1 + playlistSelect.options.length) %
            playlistSelect.options.length;
        playlistSelect.selectedIndex = currentIndex;
        loadSong();
        playAudio();
    });

    nextBtn.addEventListener("click", function () {
        let currentIndex = playlistSelect.selectedIndex;
        currentIndex = (currentIndex + 1) % playlistSelect.options.length;
        playlistSelect.selectedIndex = currentIndex;
        loadSong();
        playAudio();
    });

    loopBtn.addEventListener("click", function () {
        audio.loop = !audio.loop;
        if (audio.loop) {
            loopBtn.classList.remove("text-gray-400");
            loopBtn.classList.add("text-burgundy", "font-bold");
        } else {
            loopBtn.classList.remove("text-burgundy", "font-bold");
            loopBtn.classList.add("text-gray-400");
        }
    });

    audio.addEventListener("ended", function () {
        if (!audio.loop) {
            nextBtn.click();
        }
    });

    audio.addEventListener("timeupdate", function () {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.value = progressPercent;

            let curMin = Math.floor(audio.currentTime / 60);
            let curSec = Math.floor(audio.currentTime % 60);
            if (curSec < 10) curSec = "0" + curSec;
            currentTimeEl.innerText = `${curMin}:${curSec}`;

            let durMin = Math.floor(audio.duration / 60);
            let durSec = Math.floor(audio.duration % 60);
            if (durSec < 10) durSec = "0" + durSec;
            totalDurationEl.innerText = `${durMin}:${durSec}`;
        }
    });

    progress.addEventListener("input", function () {
        if (audio.duration) {
            audio.currentTime = (progress.value / 100) * audio.duration;
        }
    });

    muteBtn.addEventListener("click", function () {
        audio.muted = !audio.muted;
        if (audio.muted) {
            volumeIcon.classList.remove("fa-volume-high");
            volumeIcon.classList.add("fa-volume-xmark", "text-red-500");
        } else {
            volumeIcon.classList.remove("fa-volume-xmark", "text-red-500");
            volumeIcon.classList.add("fa-volume-high");
        }
    });

    loadSong();
    playAudio();
});

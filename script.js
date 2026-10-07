const weddingDate = new Date("Oct 18, 2026 10:00:00").getTime();

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
    const volumeControl = document.getElementById("volume-control");
    const volumeLevel = document.getElementById("volume-level");
    const playerToggle = document.getElementById("music-player-toggle");
    const musicPlayer = document.getElementById("music-player");
    const playerShow = document.getElementById("music-player-show");

    let isPlaying = false;
    let lastVolume = 1;

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

    function updateVolumeIcon() {
        volumeLevel.innerText = `${Math.round(audio.volume * 100)}%`;
        volumeControl.style.setProperty(
            "--volume-progress",
            `${audio.volume * 100}%`,
        );
        volumeIcon.classList.remove(
            "fa-volume-high",
            "fa-volume-low",
            "fa-volume-xmark",
            "text-red-500",
        );

        if (audio.muted || audio.volume === 0) {
            volumeIcon.classList.add("fa-volume-xmark", "text-red-500");
        } else if (audio.volume <= 0.5) {
            volumeIcon.classList.add("fa-volume-low");
        } else {
            volumeIcon.classList.add("fa-volume-high");
        }
    }

    function updateProgressBar() {
        const percent = audio.duration
            ? (audio.currentTime / audio.duration) * 100
            : 0;

        progress.value = percent;
        progress.style.setProperty("--progress", `${percent}%`);
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
        const icon = loopBtn.querySelector("i") || loopBtn;
        if (audio.loop) {
            loopBtn.classList.remove("text-gray-600", "text-gray-400");
            loopBtn.classList.add("text-burgundy", "font-bold");
            
        } else {
            loopBtn.classList.remove("text-burgundy", "font-bold");
            loopBtn.classList.add("text-gray-600");
        }
    });

    audio.addEventListener("ended", function () {
        if (!audio.loop) {
            nextBtn.click();
        }
    });

    audio.addEventListener("timeupdate", function () {
        if (audio.duration) {
            updateProgressBar();

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
            updateProgressBar();
        }
    });

    muteBtn.addEventListener("click", function () {
        if (audio.volume > 0) {
            // Đang có tiếng -> nhớ mức hiện tại rồi về 0
            lastVolume = audio.volume;
            audio.volume = 0;
        } else {
            // Đang là 0 -> trả về mức gần nhất (mặc định 0.5 nếu chưa có)
            audio.volume = lastVolume > 0 ? lastVolume : 0.5;
        }

        audio.muted = false;
        volumeControl.value = audio.volume; // đồng bộ thanh kéo
        updateVolumeIcon();
    });

    volumeControl.addEventListener("input", function () {
        audio.volume = Number(volumeControl.value);
        if (audio.volume > 0) {
            audio.muted = false;
        }
        updateVolumeIcon();
    });

    volumeControl.addEventListener("change", function () {
        const v = Number(volumeControl.value);
        if (v > 0) {
            lastVolume = v;
        }
    });

    playerToggle.addEventListener("click", function () {
        musicPlayer.classList.add("hidden");
        playerShow.classList.remove("hidden");
        playerToggle.setAttribute("aria-expanded", "false");
        playerShow.focus();
    });

    playerShow.addEventListener("click", function () {
        playerShow.classList.add("hidden");
        musicPlayer.classList.remove("hidden");
        playerToggle.setAttribute("aria-expanded", "true");
        playerToggle.focus();
    });

    document.querySelectorAll("[data-copy-account]").forEach((button) => {
        button.addEventListener("click", async function () {
            const accountNumber = button.getAttribute("data-copy-account");
            const card = button.closest("#gift .bg-white");
            const status = card.querySelector("[data-copy-status]");
            const label = button.querySelector("[data-copy-label]");
            let copied = false;

            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(accountNumber);
                    copied = true;
                } catch (error) {
                    console.warn("Không thể dùng Clipboard API, thử cách dự phòng.", error);
                }
            }

            if (!copied) {
                const temporaryInput = document.createElement("textarea");
                temporaryInput.value = accountNumber;
                temporaryInput.setAttribute("readonly", "");
                temporaryInput.style.position = "fixed";
                temporaryInput.style.opacity = "0";
                document.body.appendChild(temporaryInput);
                temporaryInput.select();
                copied = document.execCommand("copy");
                temporaryInput.remove();
            }

            if (copied) {
                label.textContent = "Đã sao chép";
                status.textContent = "Đã sao chép số tài khoản.";
                window.setTimeout(() => {
                    label.textContent = "Sao chép";
                    status.textContent = "";
                }, 2000);
            } else {
                status.textContent =
                    "Không sao chép được. Vui lòng chọn và sao chép số tài khoản thủ công.";
            }
        });
    });

    const nav = document.getElementById("main-nav");
    const hero = document.querySelector("section"); // section đầu tiên = hero

    function updateNavShadow() {
        const heroBottom = hero.offsetHeight - nav.offsetHeight;
        nav.classList.toggle("nav-scrolled", window.scrollY >= heroBottom);
    }

    window.addEventListener("scroll", updateNavShadow, { passive: true });
    window.addEventListener("resize", updateNavShadow);
    updateNavShadow();

    loadSong();
    playAudio();
    updateVolumeIcon();
});

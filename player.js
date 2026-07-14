			(function () {
				const audio = document.getElementById("bg-music");
				const button = document.getElementById("music-toggle");
				const progress = document.getElementById("music-progress");
				const current = document.getElementById("music-current");
				const total = document.getElementById("music-total");
				if (!audio || !button || !progress || !current || !total) return;

				let progressTimer = null;

				const formatTime = (seconds) => {
					if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
					const mins = Math.floor(seconds / 60);
					const secs = Math.floor(seconds % 60)
						.toString()
						.padStart(2, "0");
					return `${mins}:${secs}`;
				};

				const updateLabel = () => {
					button.textContent = audio.paused ? "▶" : "⏸";
					button.setAttribute("aria-label", audio.paused ? "Reproducir musica" : "Pausar musica");
				};

				const updateProgress = () => {
					const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
					const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
					const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
					progress.value = String(percent);
					current.textContent = formatTime(currentTime);
					total.textContent = formatTime(duration);
				};

				const startProgressLoop = () => {
					if (progressTimer) clearInterval(progressTimer);
					progressTimer = window.setInterval(updateProgress, 250);
				};

				const tryPlay = () => {
					audio.volume = 1;
					audio.play().then(() => {
						updateLabel();
						updateProgress();
					}).catch(() => {
						updateLabel();
						updateProgress();
					});
				};

				button.addEventListener("click", () => {
					if (audio.paused) {
						tryPlay();
					} else {
						audio.pause();
						updateLabel();
						updateProgress();
					}
				});

				progress.addEventListener("input", () => {
					if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
					const ratio = Number(progress.value) / 100;
					audio.currentTime = ratio * audio.duration;
					updateProgress();
				});

				audio.addEventListener("timeupdate", updateProgress);
				audio.addEventListener("loadedmetadata", updateProgress);
				audio.addEventListener("durationchange", updateProgress);
				audio.addEventListener("play", updateLabel);
				audio.addEventListener("pause", updateLabel);

				const unlockOnce = () => {
					tryPlay();
					window.removeEventListener("pointerdown", unlockOnce);
					window.removeEventListener("keydown", unlockOnce);
				};

				window.addEventListener("pointerdown", unlockOnce, { once: true });
				window.addEventListener("keydown", unlockOnce, { once: true });

				startProgressLoop();
				updateLabel();
				updateProgress();
			})();

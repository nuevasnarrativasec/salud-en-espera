(function () {
    var section = document.getElementById('voz-section');
    if (!section) return;
    var audio = section.querySelector('.voz-audio-el');
    var playBtn = section.querySelector('.js-voz-play');
    var rangeEl = section.querySelector('.js-voz-range');
    var currEl = section.querySelector('.js-voz-current');
    var durEl = section.querySelector('.js-voz-duration');

    function fmt(s) {
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function setPlaying(playing) {
        var pi = playBtn.querySelector('.icon-play');
        var pa = playBtn.querySelector('.icon-pause');
        if (pi) pi.hidden = playing;
        if (pa) pa.hidden = !playing;
    }

    playBtn.addEventListener('click', function () {
        if (audio.paused) { audio.play().catch(function () { }); }
        else { audio.pause(); }
    });

    audio.addEventListener('play', function () { setPlaying(true); });
    audio.addEventListener('pause', function () { setPlaying(false); });
    audio.addEventListener('ended', function () {
        setPlaying(false);
        rangeEl.value = 0;
        if (currEl) currEl.textContent = '0:00';
    });
    audio.addEventListener('loadedmetadata', function () {
        if (durEl) durEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener('timeupdate', function () {
        if (!audio.duration) return;
        rangeEl.value = (audio.currentTime / audio.duration) * 100;
        if (currEl) currEl.textContent = fmt(audio.currentTime);
    });
    rangeEl.addEventListener('input', function () {
        if (audio.duration) audio.currentTime = (rangeEl.value / 100) * audio.duration;
    });

    new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && !audio.paused) {
            audio.pause();
            setPlaying(false);
        }
    }, { threshold: 0 }).observe(section);
})();

(function () {
    var card = document.getElementById('mayteCard2');
    var closeBtn = document.getElementById('mayteClose2');
    var section = document.getElementById('enfermedad-section');
    if (!card || !section) return;

    var interacted = false;

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        interacted = true;
        card.classList.remove('is-open');
        card.classList.add('is-peeking');
    });

    card.addEventListener('click', function () {
        if (card.classList.contains('is-peeking')) {
            card.classList.remove('is-peeking');
            card.classList.add('is-open');
        }
    });

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            card.classList.add(interacted ? 'is-peeking' : 'is-open');
        } else {
            card.classList.remove('is-open', 'is-peeking');
        }
    }, { threshold: 0.15 });

    observer.observe(section);
})();

(function () {
    var card = document.getElementById('mayteCard');
    var closeBtn = document.getElementById('mayteClose');
    var section = document.querySelector('.sistema-h2');
    if (!card || !section) return;

    var interacted = false;

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        interacted = true;
        card.classList.remove('is-open');
        card.classList.add('is-peeking');
    });

    card.addEventListener('click', function () {
        if (card.classList.contains('is-peeking')) {
            card.classList.remove('is-peeking');
            card.classList.add('is-open');
        }
    });

    var nivelesSection = document.getElementById('nivelesSection');

    function checkScroll() {
        var rect = section.getBoundingClientRect();
        var pastNiveles = nivelesSection && nivelesSection.getBoundingClientRect().top <= 0;
        if (rect.top <= 50 && !pastNiveles) {
            card.classList.add(interacted ? 'is-peeking' : 'is-open');
        } else {
            card.classList.remove('is-open', 'is-peeking');
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
})();

(function () {
    var card = document.getElementById('mayteCard3');
    var closeBtn = document.getElementById('mayteClose3');
    var section = document.getElementById('establecimientos');
    if (!card || !section) return;

    var interacted = false;

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        interacted = true;
        card.classList.remove('is-open');
        card.classList.add('is-peeking');
    });

    card.addEventListener('click', function () {
        if (card.classList.contains('is-peeking')) {
            card.classList.remove('is-peeking');
            card.classList.add('is-open');
        }
    });

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            card.classList.add(interacted ? 'is-peeking' : 'is-open');
        } else {
            card.classList.remove('is-open', 'is-peeking');
        }
    }, { threshold: 0.15 });

    observer.observe(section);
})();

(function () {
    var card = document.getElementById('mayteCard5');
    var closeBtn = document.getElementById('mayteClose5');
    var section = document.getElementById('esSection');
    if (!card || !section) return;

    var interacted = false;

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        interacted = true;
        card.classList.remove('is-open');
        card.classList.add('is-peeking');
    });

    card.addEventListener('click', function () {
        if (card.classList.contains('is-peeking')) {
            card.classList.remove('is-peeking');
            card.classList.add('is-open');
        }
    });

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            card.classList.add(interacted ? 'is-peeking' : 'is-open');
        } else {
            card.classList.remove('is-open', 'is-peeking');
        }
    }, { threshold: 0.15 });

    observer.observe(section);
})();

(function () {
    var card = document.getElementById('mayteCard4');
    var closeBtn = document.getElementById('mayteClose4');
    var section = document.getElementById('brecha-section');
    if (!card || !section) return;

    var interacted = false;

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        interacted = true;
        card.classList.remove('is-open');
        card.classList.add('is-peeking');
    });

    card.addEventListener('click', function () {
        if (card.classList.contains('is-peeking')) {
            card.classList.remove('is-peeking');
            card.classList.add('is-open');
        }
    });

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            card.classList.add(interacted ? 'is-peeking' : 'is-open');
        } else {
            card.classList.remove('is-open', 'is-peeking');
        }
    }, { threshold: 0.15 });

    observer.observe(section);
})();

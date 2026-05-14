(function () {
    var grid = document.querySelector('.subsectores-grid');
    var prevBtn = document.querySelector('.ss-carousel-prev');
    var nextBtn = document.querySelector('.ss-carousel-next');
    var btns = Array.from(document.querySelectorAll('.js-subsector'));
    if (!grid || !prevBtn) return;

    var total = btns.length;
    var idx = 0;

    function isMobile() { return window.innerWidth < 768; }

    function updateArrows() {
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = idx === total - 1;
    }

    function goTo(i, smooth) {
        idx = Math.max(0, Math.min(total - 1, i));
        var w = grid.offsetWidth;
        if (smooth === false) {
            var prev = grid.style.scrollBehavior;
            grid.style.scrollBehavior = 'auto';
            grid.scrollLeft = idx * w;
            grid.style.scrollBehavior = '';
        } else {
            grid.scrollLeft = idx * w;
        }
        updateArrows();
    }

    prevBtn.addEventListener('click', function () { if (isMobile()) goTo(idx - 1); });
    nextBtn.addEventListener('click', function () { if (isMobile()) goTo(idx + 1); });

    // Sync index after native swipe settles
    var scrollTimer;
    grid.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
            if (!isMobile()) return;
            var w = grid.offsetWidth;
            if (w > 0) { idx = Math.round(grid.scrollLeft / w); updateArrows(); }
        }, 250);
    }, { passive: true });

    window.addEventListener('resize', function () {
        if (isMobile()) goTo(idx, false);
    });

    updateArrows();
})();

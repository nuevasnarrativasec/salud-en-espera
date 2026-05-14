(function () {
    var iframe = document.getElementById('desabastecimientoIframe');
    if (!iframe) return;

    var iframeLoaded = false;
    var animateRequested = false;
    var fired = false;

    function post() {
        if (fired) return;
        fired = true;
        iframe.contentWindow.postMessage('animate-bars', '*');
    }

    // Rastreamos la carga del iframe de forma independiente
    // porque contentDocument es null en iframes cross-origin
    iframe.addEventListener('load', function () {
        iframeLoaded = true;
        if (animateRequested) post();
    }, { once: true });

    var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        animateRequested = true;
        if (iframeLoaded) post();
    }, { threshold: 0.1 });

    observer.observe(iframe);
})();

/* Lazy, muted, looping video previews for project tiles.
   - Poster shows immediately (it is a normal <img> in the tile).
   - Nothing is downloaded on page load: the video src is only attached when a
     tile is near the viewport, and playback pauses again when it scrolls away.
   - Respects prefers-reduced-motion and Save-Data (poster only).
   - Works on mobile: muted + playsinline are forced as properties (iOS needs
     that), and a blocked autoplay is retried on the first touch/scroll. */
(function () {
    'use strict';

    var videos = Array.prototype.slice.call(document.querySelectorAll('video.tile-vid[data-src]'));
    if (!videos.length) return;

    var reduceMq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    function motionAllowed() {
        if (reduceMq && reduceMq.matches) return false;
        var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (c && c.saveData) return false;
        return true;
    }

    var visible = new Set();

    function prep(v) {
        v.muted = true;
        v.defaultMuted = true;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.removeAttribute('controls');
        v.disablePictureInPicture = true;
    }

    function play(v) {
        if (!motionAllowed()) return;
        prep(v);
        if (!v.getAttribute('src')) {
            v.src = v.getAttribute('data-src');
            v.preload = 'auto';
            v.load();
        }
        var p = v.play();
        if (p && typeof p.catch === 'function') {
            p.catch(function () { v.classList.remove('is-playing'); /* poster stays */ });
        }
    }

    function pause(v) {
        if (!v.paused) v.pause();
    }

    videos.forEach(function (v) {
        prep(v);
        v.addEventListener('playing', function () { v.classList.add('is-playing'); });
        v.addEventListener('pause', function () { /* keep last frame visible while off-screen */ });
        v.addEventListener('error', function () { v.classList.remove('is-playing'); });
    });

    function retryVisible() {
        visible.forEach(function (v) { if (v.paused) play(v); });
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                var v = e.target;
                if (e.isIntersecting) {
                    visible.add(v);
                    play(v);
                } else {
                    visible.delete(v);
                    pause(v);
                }
            });
        }, { rootMargin: '300px 0px', threshold: 0.01 });
        videos.forEach(function (v) { io.observe(v); });
    } else {
        videos.forEach(function (v) { visible.add(v); play(v); });
    }

    // Autoplay can be blocked (iOS Low Power Mode, some in-app browsers).
    // Retry once on the first real interaction; harmless if already playing.
    function onFirstGesture() {
        retryVisible();
        ['touchstart', 'pointerdown', 'scroll', 'keydown'].forEach(function (t) {
            window.removeEventListener(t, onFirstGesture, true);
        });
    }
    ['touchstart', 'pointerdown', 'scroll', 'keydown'].forEach(function (t) {
        window.addEventListener(t, onFirstGesture, { capture: true, passive: true });
    });

    // Tab hidden -> pause; tab shown -> resume the ones in view.
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) videos.forEach(pause);
        else retryVisible();
    });

    // Reduced-motion toggled at runtime.
    if (reduceMq) {
        var onMq = function () {
            if (!motionAllowed()) {
                videos.forEach(function (v) { pause(v); v.classList.remove('is-playing'); });
            } else {
                retryVisible();
            }
        };
        if (reduceMq.addEventListener) reduceMq.addEventListener('change', onMq);
        else if (reduceMq.addListener) reduceMq.addListener(onMq);
    }
})();

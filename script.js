/* ============================================================
   script.js, Vishnu Prasad portfolio v6
   Theme switch, mobile menu, project dialog with autoplaying
   videos. No dependencies.
   ============================================================ */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var colorQuery = window.matchMedia('(prefers-color-scheme: dark)');

    /* ── Theme ───────────────────────────── */
    var themeBtn = document.getElementById('themeToggle');
    var themeMeta = document.querySelector('meta[name="theme-color"]');

    function currentTheme() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function paintTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeBtn) {
            themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
        if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#161B26' : '#F3F5F9');
    }

    function setTheme(theme, persist) {
        if (!reduceMotion.matches) {
            root.classList.add('theme-anim');
            window.setTimeout(function () { root.classList.remove('theme-anim'); }, 400);
        }
        paintTheme(theme);
        if (persist) {
            try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
        }
    }

    paintTheme(currentTheme());

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
        });
    }

    // Follow the operating system only while the visitor has not chosen a theme.
    function onSystemChange(e) {
        var stored = null;
        try { stored = localStorage.getItem('theme'); } catch (err) {}
        if (stored !== 'light' && stored !== 'dark') setTheme(e.matches ? 'dark' : 'light', false);
    }
    if (colorQuery.addEventListener) colorQuery.addEventListener('change', onSystemChange);
    else if (colorQuery.addListener) colorQuery.addListener(onSystemChange);

    /* ── Mobile menu ─────────────────────── */
    var menuBtn = document.getElementById('menuBtn');
    var nav = document.getElementById('siteNav');

    function setMenu(open) {
        if (!menuBtn || !nav) return;
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
        });
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
                setMenu(false);
                menuBtn.focus();
            }
        });
        window.matchMedia('(min-width: 821px)').addEventListener('change', function (e) {
            if (e.matches) setMenu(false);
        });
    }

    /* ── Tile images: if a file is missing, drop the picture area instead of showing a broken box ── */
    document.addEventListener('error', function (e) {
        var t = e.target;
        if (!t || t.tagName !== 'IMG' || !t.closest) return;
        var art = t.closest('.tile-art');
        if (!art) return;
        t.remove();
        // Keep the area if a tile video lives in it: a missing poster must not hide the preview video.
        if (!art.querySelector('img, video')) art.hidden = true;
    }, true);

    /* ── Back to top ─────────────────────────
       The #top target is the sticky header, which is already "in view" at any scroll position,
       so the browser's native anchor jump has nothing to scroll to. Scroll the window itself. */
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href="#top"]');
        if (!a || e.defaultPrevented || e.button) return;
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        if (history.replaceState) history.replaceState(null, '', '#top');
    });

    /* ── Language radials: arm them, then spin and fill each ring as it scrolls into view ── */
    var langs = document.querySelectorAll('.lang');
    if (langs.length && 'IntersectionObserver' in window) {
        var langObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                langObserver.unobserve(el);
                var i = Array.prototype.indexOf.call(langs, el);
                window.setTimeout(function () { el.classList.remove('is-armed'); }, i * 160);
            });
        }, { threshold: 0.6 });
        langs.forEach(function (el) {
            el.classList.add('is-armed');
            langObserver.observe(el);
        });
    }

    /* ── Project dialog ──────────────────── */
    var dialog = document.getElementById('projectDialog');
    var content = document.getElementById('pdContent');
    var closeBtn = document.getElementById('pdClose');
    var opener = null;

    // Videos start by themselves when a project opens (muted, so browsers allow it).
    // Visitors who asked their system for reduced motion keep the controls and press play themselves.
    function playVideos() {
        if (reduceMotion.matches) return;
        content.querySelectorAll('video').forEach(function (v) {
            v.muted = true;
            var p = v.play();
            if (p && typeof p.catch === 'function') p.catch(function () { /* blocked, controls stay available */ });
        });
    }

    function openProject(id, trigger) {
        var tpl = document.getElementById('p-' + id);
        if (!dialog || !content || !tpl) return;
        content.replaceChildren(tpl.content.cloneNode(true));
        opener = trigger || null;
        if (!dialog.open) dialog.showModal();
        dialog.scrollTop = 0;
        root.classList.add('modal-open');
        playVideos();
    }

    if (dialog && content) {
        // One delegated handler covers tiles, list rows and inline links.
        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('[data-open]');
            if (!trigger) return;
            e.preventDefault();
            openProject(trigger.getAttribute('data-open'), trigger);
        });

        if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });

        // Click on the backdrop closes. The dialog has no padding, so a click whose target is
        // the dialog itself can only be the backdrop.
        dialog.addEventListener('click', function (e) {
            if (e.target === dialog) dialog.close();
        });

        // Escape is handled natively by <dialog>. On close: stop media, unlock scroll, return focus.
        dialog.addEventListener('close', function () {
            content.querySelectorAll('video').forEach(function (v) { v.pause(); });
            content.replaceChildren();
            root.classList.remove('modal-open');
            if (opener && document.contains(opener)) opener.focus();
            opener = null;
        });

        // Media that is not present in the repository is hidden instead of showing a broken box.
        dialog.addEventListener('error', function (e) {
            var t = e.target;
            if (!t || !t.closest) return;
            // A video with several sources only fails once its last source fails.
            if (t.tagName === 'SOURCE' && t.nextElementSibling && t.nextElementSibling.tagName === 'SOURCE') return;
            var fig = t.closest('figure');
            if (!fig) return;
            fig.hidden = true;
            // If nothing in the media block is left, drop the whole block so no empty gap remains.
            var media = fig.closest('.pd-media');
            if (media && !media.querySelector('figure:not([hidden])')) media.hidden = true;
        }, true);
    }
})();

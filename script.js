/* ============================================================
   script.js — Vishnu Prasad Portfolio v4
   ============================================================ */

/* ─── 1. CUSTOM CURSOR ─────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});
(function tick() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
})();

document.querySelectorAll('a,button,.sk-chips span,.proj-chips span,.cs-card,.polaroid-stack').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
        cursor.style.background = 'rgba(0,212,255,0.4)';
        ring.style.width = ring.style.height = '48px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = 'var(--accent)';
        ring.style.width = ring.style.height = '30px';
    });
});

/* ─── 2. HERO CANVAS ──────────────────── */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let W, H, pts = [];

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
function initPts() {
    pts = [];
    const n = Math.floor(W / 14);
    for (let i = 0; i < n; i++) {
        pts.push({
            x: Math.random() * W, y: Math.random() * H,
            r: Math.random() * 1.2 + 0.2,
            vx: (Math.random() - .5) * .25,
            vy: (Math.random() - .5) * .25,
            a: Math.random()
        });
    }
}
resize(); initPts();
window.addEventListener('resize', () => { resize(); initPts(); });

(function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,212,255,0.022)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${.12 + p.a * .2})`;
        ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
            const d  = Math.sqrt(dx*dx + dy*dy);
            if (d < 110) {
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.strokeStyle = `rgba(0,212,255,${.045 * (1 - d/110)})`;
                ctx.lineWidth = .4;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(draw);
})();

/* ─── 3. TYPED.JS ─────────────────────── */
new Typed('#typed', {
    strings: [
        'XR Developer · Robotics Engineer',
        'Unity · MRTK 3 · OpenXR',
        'ROS · SLAM · Autonomous Systems',
        'VR · MR · AR · Simulation',
        'Building Immersive & Intelligent Systems'
    ],
    typeSpeed: 50, backSpeed: 25, backDelay: 2000, loop: true
});

/* ─── 4. AOS ──────────────────────────── */
AOS.init({ duration: 850, once: true, easing: 'ease-out-cubic', offset: 50 });

/* ─── 5. NAVBAR ───────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

/* ─── 6. LANGUAGE CIRCLES ─────────────── */
const circumference = 2 * Math.PI * 28;
const langSection = document.getElementById('langCircles') || document.body;
new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('.lc-prog').forEach(c => {
                const pct = parseFloat(c.getAttribute('data-pct')) || 0;
                c.style.strokeDasharray  = circumference;
                c.style.strokeDashoffset = circumference * (1 - pct / 100);
            });
        }
    });
}, { threshold: 0.4 }).observe(langSection);

/* ─── 7. CASE STUDY IMAGE STRIP ─────────
   Auto-slideshow with dot navigation
────────────────────────────────────────── */
function initStrip(stripId, dotsId) {
    const strip  = document.getElementById(stripId);
    const dotsEl = document.getElementById(dotsId);
    if (!strip || !dotsEl) return;

    const items = strip.querySelectorAll('.strip-item');
    const count = items.length;
    let current = 0;

    // Build dots
    for (let i = 0; i < count; i++) {
        const d = document.createElement('span');
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
    }

    // Lock strip dimensions
    strip.style.display = 'flex';
    strip.style.width = `${count * 100}%`;
    items.forEach(it => { it.style.flex = `0 0 ${100 / count}%`; });

    function goTo(n) {
        current = (n + count) % count;
        strip.style.transform = `translateX(-${current * (100 / count)}%)`;
        strip.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        dotsEl.querySelectorAll('span').forEach((d, i) =>
            d.classList.toggle('active', i === current));
    }

    setInterval(() => goTo(current + 1), 3200);
}

initStrip('strip-vr',    'dots-vr');
initStrip('strip-solar', 'dots-solar');

/* ─── 8. POLAROID STACK — tap to fan on mobile + hint ─── */
document.querySelectorAll('.polaroid-stack').forEach(stack => {
    stack.addEventListener('click', () => stack.classList.toggle('fanned'));
    const hint = document.createElement('p');
    hint.className = 'pol-hint';
    hint.textContent = 'hover to fan · tap on mobile';
    stack.insertAdjacentElement('afterend', hint);
});

/* ─── 9. MKV VIDEO FALLBACK ──────────── */
document.querySelectorAll('.cs-video').forEach(vid => {
    vid.addEventListener('error', () => {
        const notice = vid.closest('.cs-video-wrap')?.querySelector('.mkv-notice');
        if (notice) notice.classList.add('visible');
    });
    setTimeout(() => {
        if (vid.readyState === 0 || vid.networkState === 3) {
            const notice = vid.closest('.cs-video-wrap')?.querySelector('.mkv-notice');
            if (notice) notice.classList.add('visible');
        }
    }, 2500);
});

/* ─── 9b. BOT VIDEO — scroll-triggered autoplay ── */
const botVid = document.getElementById('botVid');
if (botVid) {
    new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                botVid.play();
            } else {
                botVid.pause();
            }
        });
    }, { threshold: 0.3 }).observe(botVid);

    botVid.addEventListener('error', () => {
        const notice = botVid.closest('.proj-bot-video')?.querySelector('.mkv-notice');
        if (notice) notice.classList.add('visible');
    });
}

/* ─── 10. SKILLS chip ripple ──────────── */
document.querySelectorAll('.sk-chips span').forEach(s => {
    s.addEventListener('click', () => {
        s.style.borderColor = 'var(--accent)';
        s.style.color = 'var(--accent)';
        s.style.background = 'rgba(0,212,255,.1)';
        setTimeout(() => {
            s.style.borderColor = '';
            s.style.color = '';
            s.style.background = '';
        }, 600);
    });
});

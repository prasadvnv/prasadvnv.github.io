/* ============================================================
   script.js — Vishnu Prasad Portfolio
   ============================================================ */

/* ─────────────────────────────────────────
   1. TYPED.JS  — animated hero subtitle
───────────────────────────────────────── */
new Typed('#typed', {
    strings: [
        "XR / VR Developer",
        "Unity · OpenXR · MRTK 3",
        "ROS · SLAM · Robotics",
        "Building Immersive Experiences"
    ],
    typeSpeed:  55,
    backSpeed:  28,
    backDelay: 1800,
    loop: true
});

/* ─────────────────────────────────────────
   2. AOS  — scroll animations
───────────────────────────────────────── */
AOS.init({
    duration: 800,
    once: true
});

/* ─────────────────────────────────────────
   3. NAVBAR  — toggle (mobile) & shrink on scroll
───────────────────────────────────────── */
function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
}

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.style.padding = window.scrollY > 50 ? '0.7rem 5%' : '1.1rem 5%';
});

/* ─────────────────────────────────────────
   4. SKILLS  — data + dynamic rendering
   Add / remove skill objects here to update the section
───────────────────────────────────────── */
const skills = [
    { icon: 'fas fa-vr-cardboard',      label: 'Unity 3D · MRTK 3 · OpenXR' },
    { icon: 'fas fa-code',              label: 'C# · Python · MATLAB' },
    { icon: 'fas fa-robot',             label: 'ROS · SLAM · Path Planning' },
    { icon: 'fas fa-cube',              label: 'VR/MR Simulation' },
    { icon: 'fas fa-camera',            label: 'Motion Capture · Full-Body Tracking' },
    { icon: 'fas fa-microchip',         label: 'Sensor Integration' },
    { icon: 'fas fa-drafting-compass',  label: 'Blender · SolidWorks · Ansys' },
    { icon: 'fas fa-file-alt',          label: 'Documentation & Handover Workflows' },
    { icon: 'fas fa-cogs',              label: 'XR Interaction Toolkit' },
];

const skillsGrid = document.getElementById('skillsGrid');

skills.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'skill-item';
    el.setAttribute('data-aos', 'fade-up');
    el.setAttribute('data-aos-delay', i * 60);
    el.innerHTML = `
        <div class="skill-icon"><i class="${s.icon}"></i></div>
        <span>${s.label}</span>
    `;
    skillsGrid.appendChild(el);
});

/* ─────────────────────────────────────────
   5. PROJECTS  — data + dynamic rendering
   Add your projects here; cards are generated automatically
───────────────────────────────────────── */
const projects = [
    {
        name:        "VR Safety Training",
        description: "Immersive VR training simulation for industrial environments using Unity, C#, and OpenXR.",
        link:        "https://github.com/prasadvnv/VR-Safety-Training---Industrial-Oven"
    },
    {
        name:        "Dual Axis Solar Tracker",
        description: "Smart solar tracking system using Arduino and Python for maximum energy efficiency.",
        link:        "https://github.com/prasadvnv/Dual-Axis-Solar-Tracker"
    },
    {
        name:        "Inventory Bot with SLAM",
        description: "Autonomous mobile robot using ROS, LiDAR, and camera sensors for warehouse inventory management.",
        link:        "https://github.com/prasadvnv/Inventory-Bot"
    }
];

const projectList = document.getElementById('project-list');

projects.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', i * 100);
    card.innerHTML = `
        <div class="card-num">0${i + 1}</div>
        <h3>${proj.name}</h3>
        <p>${proj.description}</p>
        <a href="${proj.link}" target="_blank" class="card-link">
            View on GitHub <i class="fas fa-arrow-right"></i>
        </a>
    `;
    projectList.appendChild(card);
});

/* Apply VanillaTilt after cards are in the DOM */
VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max:          10,
    speed:       400,
    glare:       true,
    'max-glare': 0.15
});

/* ─────────────────────────────────────────
   6. LANGUAGE CIRCLES  — animated on scroll
   levelMap keys must match the data-level attributes in index.html
───────────────────────────────────────── */
const levelMap = {
    'C1':     85,
    'B1':     45,
    'Native': 100
};

const circumference = 2 * Math.PI * 50; // r = 50

function animateCircles() {
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const level = circle.getAttribute('data-level');
        const pct   = levelMap[level] || 0;
        circle.style.strokeDasharray  = circumference;
        circle.style.strokeDashoffset = circumference * (1 - pct / 100);
    });
}

/* Fire animation when #languages scrolls into view */
const langObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) animateCircles();
    });
}, { threshold: 0.3 });

const langSection = document.getElementById('languages');
if (langSection) langObserver.observe(langSection);

/* ─────────────────────────────────────────
   7. CONTACT FORM  — mock submit feedback
   Replace this with a real backend / EmailJS / Formspree call
───────────────────────────────────────── */
function handleForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');

    // Show success state
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = '#00c851';
    btn.disabled = true;

    // Reset after 3 seconds
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.style.background = '';
        btn.disabled = false;
        e.target.reset();
    }, 3000);
}

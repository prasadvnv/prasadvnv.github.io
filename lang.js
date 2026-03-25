function animateCircle(circle, levelPercent) {
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - levelPercent / 100);
    circle.style.strokeDashoffset = offset;
}

// Map levels to percentage
const levelMap = {
    'C1': 85,
    'B1': 45,
    'Native': 100
};

// Animate when section comes into view
const langItems = document.querySelectorAll('.lang-item');

function checkScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    langItems.forEach(item => {
        const boxTop = item.getBoundingClientRect().top;
        if(boxTop < triggerBottom && !item.classList.contains('animated')){
            const levelText = item.querySelector('.level-text').textContent;
            const progressCircle = item.querySelector('.progress-circle');
            animateCircle(progressCircle, levelMap[levelText]);
            item.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);
let counter = 0;
const counterValue = document.getElementById('counter-value');
const clickMeButton = document.getElementById('click-me');
const module1 = document.getElementById('module1');
let pressTimer;
let moveInterval;
let progress = 0;

// Add to HTML inside button
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
clickMeButton.appendChild(progressBar);

// Initialize button position
function centerButton() {
    const moduleRect = module1.getBoundingClientRect();
    const buttonRect = clickMeButton.getBoundingClientRect();
    const x = (moduleRect.width - buttonRect.width) / 2;
    const y = (moduleRect.height - buttonRect.height) / 2;
    setButtonPosition(x, y);
}

function setButtonPosition(x, y) {
    const moduleRect = module1.getBoundingClientRect();
    const buttonRect = clickMeButton.getBoundingClientRect();
    
    // Ensure button stays within module bounds
    const maxX = moduleRect.width - buttonRect.width;
    const maxY = moduleRect.height - buttonRect.height;
    const boundedX = Math.min(Math.max(0, x), maxX);
    const boundedY = Math.min(Math.max(0, y), maxY);
    
    clickMeButton.style.left = `${boundedX}px`;
    clickMeButton.style.top = `${boundedY}px`;
}

function moveButtonSlightly() {
    const currentX = parseFloat(clickMeButton.style.left) || 0;
    const currentY = parseFloat(clickMeButton.style.top) || 0;
    
    // Small random movement
    const offsetX = Math.random() * 4 * (Math.random() < 0.5 ? -1 : 1);
    const offsetY = Math.random() * 4 * (Math.random() < 0.5 ? -1 : 1);
    
    setButtonPosition(currentX + offsetX, currentY + offsetY);
}

function updateProgress() {
    progress++;
    const progressPercent = (progress / 200) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function resetButton() {
    progress = 0;
    progressBar.style.width = '0%';
    centerButton();
}

clickMeButton.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
        counter++;
        counterValue.textContent = counter;
        resetButton();
    }, 10000);

    moveInterval = setInterval(() => {
        moveButtonSlightly();
        updateProgress();
    }, 50);
});

clickMeButton.addEventListener('mouseup', () => {
    clearTimeout(pressTimer);
    clearInterval(moveInterval);
    resetButton();
});

clickMeButton.addEventListener('mouseleave', () => {
    clearTimeout(pressTimer);
    clearInterval(moveInterval);
    resetButton();
});

// Initial setup
module1.style.position = 'relative';
clickMeButton.style.position = 'absolute';
centerButton();
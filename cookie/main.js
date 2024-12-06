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

let currentProblem = null;

// Load math problems
async function loadMathProblems() {
    return [
        {
            "question": "What is 1337 × 42?",
            "answer": 56154
        },
        {
            "question": "What is 9876 ÷ 23?",
            "answer": 429
        },
        {
            "question": "What is 789 × 456?",
            "answer": 359784
        },
        {
            "question": "What is 12345 ÷ 67?",
            "answer": 184
        },
        {
            "question": "What is 888 × 999?",
            "answer": 887112
        }
    ]
}

// Set up Module 2
const module2 = document.getElementById('module2');
const problemDisplay = document.createElement('div');
problemDisplay.id = 'problem-display';
const answerSlider = document.createElement('input');
answerSlider.type = 'range';
answerSlider.id = 'answer-slider';
answerSlider.min = '0';
answerSlider.max = '1000000';
answerSlider.value = '500000';
const sliderValue = document.createElement('span');
sliderValue.id = 'slider-value';
sliderValue.textContent = '500000';
const submitAnswer = document.createElement('button');
submitAnswer.id = 'submit-answer';
submitAnswer.textContent = 'Submit Answer';

module2.innerHTML = '';
module2.appendChild(problemDisplay);
module2.appendChild(answerSlider);
module2.appendChild(sliderValue);
module2.appendChild(submitAnswer);

// Update slider value display in real-time
answerSlider.addEventListener('input', () => {
    sliderValue.textContent = answerSlider.value;
});

// Handle answer submission
submitAnswer.addEventListener('click', async () => {
    if (currentProblem && parseInt(answerSlider.value) === currentProblem.answer) {
        counter++;
        counterValue.textContent = counter;
        await displayRandomProblem();
    }
});

// Display random problem
async function displayRandomProblem() {
    const problems = await loadMathProblems();
    if (problems.length > 0) {
        currentProblem = problems[Math.floor(Math.random() * problems.length)];
        problemDisplay.textContent = currentProblem.question;
        // Reset slider to middle position
        answerSlider.value = 500000;
        sliderValue.textContent = "500000";
    }
}

// Initialize first problem
displayRandomProblem();

// Module 3 setup
const module3 = document.getElementById('module3');
module3.innerHTML = `
    <div id="wordle-display"></div>
    <input type="text" id="wordle-input" maxlength="5" placeholder="5-letter word">
    <button id="wordle-submit">Submit</button>
`;

const wordleDisplay = document.getElementById('wordle-display');
const wordleInput = document.getElementById('wordle-input');
const wordleSubmit = document.getElementById('wordle-submit');
const usedDates = new Set();
let currentWordleDate = null;

function getRandomDate() {
    const start = new Date('2021-06-19');
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const dateStr = randomDate.toISOString().split('T')[0];

    // If date was already used, try again
    if (usedDates.has(dateStr)) {
        return getRandomDate();
    }

    usedDates.add(dateStr);
    return dateStr;
}

function updateWordleDisplay() {
    currentWordleDate = getRandomDate();
    wordleDisplay.textContent = `What is the WORDLE answer of the ${currentWordleDate}?`;
}

wordleSubmit.addEventListener('click', async () => {
    const input = wordleInput.value.toLowerCase().trim();
    if (input.length !== 5) return;

    try {
        const response = await fetch(`https://proxy.cors.sh/https://www.nytimes.com/svc/wordle/v2/${currentWordleDate}.json`, {
            method: 'GET',
            headers: {
                'x-cors-api-key': 'temp_b14068a96eb39cf5cba1e7924f0b106c'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Wordle data');
        }

        const data = await response.json();
        if (input === data.solution.toLowerCase()) {
            counter++;
            counterValue.textContent = counter;
            wordleInput.value = '';
            updateWordleDisplay(); // Update display after correct answer
        } else {
            wordleInput.value = ''; // Clear input
            updateWordleDisplay(); // Generate new date and update display for wrong answer
        }
    } catch (error) {
        console.error('Error fetching Wordle solution:', error);
        wordleDisplay.textContent = 'Error loading Wordle. Please try again later.';
    }
});

// Initial display
updateWordleDisplay();

// Canvas setup
const module4 = document.getElementById('module4');
const contentCanvas = document.getElementById('content-canvas');
const scratchCanvas = document.getElementById('scratchcard');
const contentCtx = contentCanvas.getContext('2d');
const scratchCtx = scratchCanvas.getContext('2d');

let isDrawing = false;
let hasCookie = false;
let scratchedPixels = 0;
let totalPixels = 0;
let hasBeenScratched = false;

// Set canvas sizes to match module
function resizeCanvas() {
    const rect = module4.getBoundingClientRect();
    contentCanvas.width = scratchCanvas.width = rect.width;
    contentCanvas.height = scratchCanvas.height = rect.height;
}

function initScratchcard() {
    resizeCanvas();
    hasCookie = Math.random() < 0.1;

    // Draw content (bottom layer)
    contentCtx.fillStyle = '#4CAF50';
    contentCtx.fillRect(0, 0, contentCanvas.width, contentCanvas.height);
    contentCtx.fillStyle = 'white';
    contentCtx.font = '24px Arial';
    contentCtx.textAlign = 'center';
    contentCtx.textBaseline = 'middle';

    if (hasCookie) {
        contentCtx.fillText('Cookie!', contentCanvas.width / 2, contentCanvas.height / 2);
    } else {
        const lines = ['Nothing', '...', '...', 'You need to scratch 90% LOL'];
        const lineHeight = 30;
        const startY = contentCanvas.height / 2 - (lines.length * lineHeight) / 2;

        lines.forEach((line, i) => {
            contentCtx.fillText(line, contentCanvas.width / 2, startY + i * lineHeight);
        });
    }

    // Draw scratch layer (top layer)
    scratchCtx.fillStyle = '#808080';
    scratchCtx.fillRect(0, 0, contentCanvas.width, contentCanvas.height);
    scratchCtx.fillStyle = 'white';
    scratchCtx.font = '24px Arial';
    scratchCtx.textAlign = 'center';
    scratchCtx.textBaseline = 'middle';
    scratchCtx.fillText('Scratch me!', scratchCanvas.width / 2, scratchCanvas.height / 2);

    totalPixels = scratchCanvas.width * scratchCanvas.height;
}

// Add window resize listener
window.addEventListener('resize', initScratchcard);

// Update event listeners to use scratchCanvas
scratchCanvas.addEventListener('mousedown', startScratching);
scratchCanvas.addEventListener('mousemove', scratch);
scratchCanvas.addEventListener('mouseup', stopScratching);
scratchCanvas.addEventListener('mouseleave', stopScratching);

function startScratching(e) {
    isDrawing = true;
    scratch(e);
}

function scratch(e) {
    if (!isDrawing || hasBeenScratched) return;

    const rect = scratchCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (scratchCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (scratchCanvas.height / rect.height);

    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 20, 0, Math.PI * 2);
    scratchCtx.fill();

    checkProgress();
}

function stopScratching() {
    isDrawing = false;
}

function checkProgress() {
    // Count scratched pixels
    const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    scratchedPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) scratchedPixels++;
    }

    // Check if mostly scratched
    if (scratchedPixels > totalPixels * 0.9 && !hasBeenScratched) {
        hasBeenScratched = true;
        if (hasCookie) {
            counter++;
            counterValue.textContent = counter;
        }
        setTimeout(resetScratchcard, 1000);
    }
}

// Initialize first scratchcard
initScratchcard();

// Add to main.js
const timerElement = document.getElementById('stress-timer');
let timeLeft = 300; // 5 minutes in seconds

const stressMessages = [
    "Be quick!",
    "Your progress will be deleted...",
    "Time is running out!",
    "Tick tock...",
    "Why so slow?",
    "Better hurry up!"
];

let messageIndex = 0;

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Rotate through stress messages
    messageIndex = (messageIndex + 1) % stressMessages.length;
    let message = stressMessages[messageIndex];

    // Make messages more urgent in last minute
    if (timeLeft < 60) {
        message = message.toUpperCase() + "!";
        timerElement.style.animation = 'flash 0.5s infinite';
    }

    timerElement.textContent = `${timeText} — ${message}`;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerElement.textContent = 'TIME\'S UP! Resetting...';
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        return;
    }

    timeLeft--;
}

const timerInterval = setInterval(updateTimer, 1000);

const messages = [
    "Sign up for our newsletter!",
    "Did you accept our cookies?",
    "Want notifications?",
    "Join our loyalty program!",
    "Take our quick survey!",
    "Subscribe to premium!",
    "Download our mobile app!",
    "Enable location services?",
    "Add to home screen?",
    "Create an account for 10% off!"
];

// Create popup
const popup = document.createElement('div');
popup.className = 'floating-popup';
popup.innerHTML = `
    <div class="popup-content">
        <span id="popup-message"></span>
        <button class="popup-close">✕</button>
    </div>
`;
document.body.appendChild(popup);

// Movement variables
let x = Math.random() * (window.innerWidth - popup.offsetWidth);
let y = Math.random() * (window.innerHeight - popup.offsetHeight);
let dx = 2;
let dy = 2;

// Update message randomly
function updateMessage() {
    const messageElement = popup.querySelector('#popup-message');
    messageElement.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// Animation function
function movePopup() {
    const maxX = window.innerWidth - popup.offsetWidth;
    const maxY = window.innerHeight - popup.offsetHeight;

    x += dx;
    y += dy;

    // Bounce off edges
    if (x <= 0 || x >= maxX) {
        dx = -dx;
        x = Math.max(0, Math.min(x, maxX));
        updateMessage();
    }
    if (y <= 0 || y >= maxY) {
        dy = -dy;
        y = Math.max(0, Math.min(y, maxY));
        updateMessage();
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    requestAnimationFrame(movePopup);
}

// Initialize
updateMessage();
requestAnimationFrame(movePopup);

// Add styles
const style = document.createElement('style');
style.textContent = `
    .floating-popup {
        position: fixed;
        padding: 15px;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }

    .popup-content {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 14px;
    }

    .popup-close {
        background: none;
        border: 2px solid #666;
        border-radius: 50%;
        color: #666;
        cursor: pointer;
        font-size: 20px;
        padding: 8px 12px;
        min-width: 40px;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .popup-close:hover {
        background: #666;
        color: white;
    }
`;
document.head.appendChild(style);

// Add click handler to close buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-close')) {
        e.preventDefault();
        e.stopPropagation();
        spawnNewPopup();
    }
});

function spawnNewPopup() {
    // Create new popup with same structure
    const newPopup = document.createElement('div');
    newPopup.className = 'floating-popup';
    newPopup.innerHTML = `
        <div class="popup-content">
            <span id="popup-message-${Date.now()}"></span>
            <button class="popup-close">✕</button>
        </div>
    `;

    // Position at random location
    let x = Math.random() * (window.innerWidth - 300); // Approximate popup width
    let y = Math.random() * (window.innerHeight - 100); // Approximate popup height
    newPopup.style.left = `${x}px`;
    newPopup.style.top = `${y}px`;

    document.body.appendChild(newPopup);

    // Set random message
    const messageElement = newPopup.querySelector(`#popup-message-${Date.now()}`);
    messageElement.textContent = messages[Math.floor(Math.random() * messages.length)];

    // Initialize movement for new popup
    let dx = 2;
    let dy = 2;

    function moveNewPopup() {
        const maxX = window.innerWidth - newPopup.offsetWidth;
        const maxY = window.innerHeight - newPopup.offsetHeight;

        x += dx;
        y += dy;

        if (x <= 0 || x >= maxX) {
            dx = -dx;
            x = Math.max(0, Math.min(x, maxX));
        }
        if (y <= 0 || y >= maxY) {
            dy = -dy;
            y = Math.max(0, Math.min(y, maxY));
        }

        newPopup.style.left = `${x}px`;
        newPopup.style.top = `${y}px`;

        requestAnimationFrame(moveNewPopup);
    }

    requestAnimationFrame(moveNewPopup);
}

// Module 5 setup
const module5 = document.getElementById('module5');
module5.innerHTML = `
    <div class="craft-container">
        <h3>Find a new discovery in Infinite Craft</h3>
        <div class="input-container">
            <input type="text" id="craft-input1" placeholder="First item">
            <input type="text" id="craft-input2" placeholder="Second item">
        </div>
        <button id="craft-submit">Craft!</button>
        <div id="craft-result"></div>
    </div>
`;

const craftInput1 = document.getElementById('craft-input1');
const craftInput2 = document.getElementById('craft-input2');
const craftSubmit = document.getElementById('craft-submit');
const craftResult = document.getElementById('craft-result');

craftSubmit.addEventListener('click', () => {
    const item1 = craftInput1.value.trim();
    const item2 = craftInput2.value.trim();

    if (!item1 || !item2) return;

    // 1/1000 chance to increment counter
    if (Math.random() < 0.001) {
        counter++;
        counterValue.textContent = counter;
        craftResult.textContent = "New discovery found!";
    } else {
        craftResult.textContent = "Nothing new discovered...";
    }

    // Clear inputs
    craftInput1.value = '';
    craftInput2.value = '';
});

// Add style for result message
const craftStyle = document.createElement('style');
craftStyle.textContent += `
    .craft-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        padding: 15px;
    }

    .craft-container h3 {
        color: white;
        text-align: center;
        margin: 0;
    }

    .input-container {
        display: flex;
        gap: 10px;
        width: 100%;
    }

    .input-container input {
        flex: 1;
        padding: 8px;
        border: none;
        border-radius: 5px;
    }

    #craft-submit {
        padding: 8px 16px;
        background-color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
    }

    #craft-submit:hover {
        background-color: #eee;
    }
`;
document.head.appendChild(craftStyle);

// Add fullscreen overlay styles
const overlayStyle = document.createElement('style');
overlayStyle.textContent = `
    #warning-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: pulse 0.5s infinite;
    }

    #warning-message {
        color: white;
        font-size: 48px;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        white-space: pre-line;
    }

    @keyframes pulse {
        0% { background-color: rgba(255, 0, 0, 0.9); }
        50% { background-color: rgba(200, 0, 0, 0.9); }
        100% { background-color: rgba(255, 0, 0, 0.9); }
    }
`;
document.head.appendChild(overlayStyle);

// Create warning overlay
const warningOverlay = document.createElement('div');
warningOverlay.id = 'warning-overlay';
warningOverlay.style.display = 'none';

const warningMessage = document.createElement('div');
warningMessage.id = 'warning-message';
warningMessage.textContent = 'GET BACK HERE NOW!\nYOU NEED MORE COOKIES!';
warningOverlay.appendChild(warningMessage);
document.body.appendChild(warningOverlay);

// Event listeners for mouse leaving/entering
document.addEventListener('mouseleave', () => {
    warningOverlay.style.display = 'flex';
});

document.addEventListener('mouseenter', () => {
    warningOverlay.style.display = 'none';
});

// Center button on page load
window.addEventListener('load', centerButton);
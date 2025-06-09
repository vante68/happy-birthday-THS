// Global variables
let currentSection = 1;
let countdownInterval;
let balloonInterval;
let typingTimeout;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Start the bear entrance animation
    setTimeout(() => {
        showBear();
    }, 1000);
    
    // Start balloon confetti after bear appears
    setTimeout(() => {
        startBalloonConfetti();
    }, 2000);
    
    // Show birthday message
    setTimeout(() => {
        showBirthdayMessage();
    }, 3500);
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Next button event listeners
    document.getElementById('nextBtn1').addEventListener('click', () => goToSection(2));
    document.getElementById('nextBtn2').addEventListener('click', () => goToSection(3));
    document.getElementById('nextBtn3').addEventListener('click', () => goToSection(4));
    
    // Letter box click event
    document.getElementById('letterBox').addEventListener('click', openLetter);
    
    // Music icon click event
    document.getElementById('musicIcon').addEventListener('click', openMusic);
}

function showBear() {
    const bearContainer = document.getElementById('bearContainer');
    bearContainer.classList.remove('hidden');
    bearContainer.classList.add('show');
}

function startBalloonConfetti() {
    const confettiContainer = document.getElementById('balloonConfetti');
    const colors = ['#FF69B4', '#FFD700', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C'];
    
    // Create initial balloons
    for (let i = 0; i < 6; i++) {
        createBalloon(confettiContainer, colors[i], i * 10);
    }
    
    // Continue creating balloons
    balloonInterval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomDelay = Math.random() * 100;
        createBalloon(confettiContainer, randomColor, randomDelay);
    }, 800);
    
    // Stop balloon creation after 10 seconds
    setTimeout(() => {
        clearInterval(balloonInterval);
    }, 10000);
}

function createBalloon(container, color, leftPosition) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.background = color;
    balloon.style.left = leftPosition + '%';
    balloon.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(balloon);
    
    // Remove balloon after animation
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.parentNode.removeChild(balloon);
        }
    }, 4000);
}

function showBirthdayMessage() {
    const birthdayMessage = document.getElementById('birthdayMessage');
    birthdayMessage.classList.remove('hidden');
    birthdayMessage.classList.add('show');
}

function goToSection(sectionNumber) {
    // Hide current section
    const currentSectionEl = document.getElementById(`section${currentSection}`);
    currentSectionEl.classList.remove('active');
    
    // Show new section
    const newSectionEl = document.getElementById(`section${sectionNumber}`);
    newSectionEl.classList.add('active');
    
    // Update current section
    currentSection = sectionNumber;
    
    // Initialize section-specific functionality
    if (sectionNumber === 2) {
        startCountdown();
    } else if (sectionNumber === 4) {
        startTypingAnimation();
    }
}

function startCountdown() {
    const targetDate = new Date('June 13, 2025 00:00:00').getTime();
    
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // Birthday has passed - show hours since birthday
            const hoursPassed = Math.floor(Math.abs(distance) / (1000 * 60 * 60));
            
            // Update the countdown title
            document.querySelector('.countdown-title').textContent = `You turned 17, ${hoursPassed} hours ago!`;
            
            // Hide the countdown timer
            document.getElementById('countdownTimer').style.display = 'none';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

function openLetter() {
    const letterBox = document.getElementById('letterBox');
    const letterContent = document.getElementById('letterContent');
    
    // Hide letter box
    letterBox.style.display = 'none';
    
    // Show letter content with animation
    letterContent.classList.remove('hidden');
    letterContent.classList.add('show');
}

function startTypingAnimation() {
    const typingIndicator = document.getElementById('typingIndicator');
    const finalMessage = document.getElementById('finalMessage');
    const contactStatus = document.getElementById('contactStatus');
    
    // Show typing indicator
    contactStatus.textContent = 'typing...';
    typingIndicator.classList.remove('hidden');
    
    // Play typing sound
    if (window.playTypingSound) {
        window.playTypingSound();
    }
    
    // Hide typing indicator and show message after 3 seconds
    typingTimeout = setTimeout(() => {
        typingIndicator.classList.add('hidden');
        contactStatus.textContent = 'online';
        
        finalMessage.classList.remove('hidden');
        finalMessage.classList.add('show');
        
        // Stop typing sound
        if (window.stopTypingSound) {
            window.stopTypingSound();
        }
    }, 3000);
}

function openMusic() {
    // Open YouTube link for the specific song
    const musicUrl = 'https://youtu.be/tNSJiebScy0?si=MuuT-UPVZnza8xCM';
    window.open(musicUrl, '_blank');
}

// Cleanup function
window.addEventListener('beforeunload', function() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    if (balloonInterval) {
        clearInterval(balloonInterval);
    }
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
});

// Touch events for mobile optimization
document.addEventListener('touchstart', function() {}, { passive: true });

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

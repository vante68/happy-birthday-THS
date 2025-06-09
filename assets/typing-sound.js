// Simple typing sound simulation using Web Audio API
class TypingSoundManager {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.intervalId = null;
        
        // Initialize audio context on first user interaction
        this.initAudioContext();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    createTypingSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Connect oscillator to gain to speakers
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configure the sound
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.05);
        
        // Configure volume envelope
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
        
        // Start and stop the oscillator
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }
    
    startTyping() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        
        // Resume audio context if it's suspended (mobile browsers)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Create typing sounds at random intervals
        const playTypingSound = () => {
            if (this.isPlaying) {
                this.createTypingSound();
                
                // Random delay between 80-200ms to simulate natural typing
                const delay = Math.random() * 120 + 80;
                this.intervalId = setTimeout(playTypingSound, delay);
            }
        };
        
        playTypingSound();
    }
    
    stopTyping() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Create global instance
const typingSoundManager = new TypingSoundManager();

// Expose functions globally
window.playTypingSound = function() {
    typingSoundManager.startTyping();
};

window.stopTypingSound = function() {
    typingSoundManager.stopTyping();
};

// Initialize on user interaction (required for audio to work on mobile)
document.addEventListener('touchstart', function initAudio() {
    if (typingSoundManager.audioContext && typingSoundManager.audioContext.state === 'suspended') {
        typingSoundManager.audioContext.resume();
    }
    document.removeEventListener('touchstart', initAudio);
}, { once: true });

document.addEventListener('click', function initAudio() {
    if (typingSoundManager.audioContext && typingSoundManager.audioContext.state === 'suspended') {
        typingSoundManager.audioContext.resume();
    }
    document.removeEventListener('click', initAudio);
}, { once: true });

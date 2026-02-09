class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.particles-container');
        this.maxParticles = 40;
        this.init();
    }
    init() {
        this.createParticles();
        this.createSparkles();
        this.createBubbles();
        this.startContinuousGeneration();
    }
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => this.createParticle(), i * 200);
        }
    }
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '-10px';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        const duration = Math.random() * 10 + 15;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        this.container.appendChild(particle);
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, (duration + 5) * 1000);
    }
    createSparkles() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => this.createSparkle(), i * 300);
        }
    }
    createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        const duration = Math.random() * 4 + 6;
        sparkle.style.animationDuration = duration + 's';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        this.container.appendChild(sparkle);
        setTimeout(() => {
            if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
        }, (duration + 3) * 1000);
    }
    createBubbles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => this.createBubble(), i * 500);
        }
    }
    createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-particle';
        const size = Math.random() * 40 + 20;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-50px';
        const duration = Math.random() * 5 + 8;
        bubble.style.animationDuration = duration + 's';
        bubble.style.animationDelay = Math.random() * 3 + 's';
        this.container.appendChild(bubble);
        setTimeout(() => {
            if (bubble.parentNode) bubble.parentNode.removeChild(bubble);
        }, (duration + 3) * 1000);
    }
    startContinuousGeneration() {
        setInterval(() => this.createParticle(), 1500);
        setInterval(() => this.createSparkle(), 2000);
        setInterval(() => this.createBubble(), 3000);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});

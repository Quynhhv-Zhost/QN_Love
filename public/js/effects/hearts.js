class HeartsEffect {
    constructor() {
        this.container = document.querySelector('.hearts-container');
        this.hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞'];
        this.styles = ['style-1', 'style-2', 'style-3'];
        
        // Detect mobile
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
        this.maxHearts = this.isMobile ? 6 : 12;  // Giảm 50%: mobile 6, desktop 12
        this.generateInterval = this.isMobile ? 2000 : 1500;  // Vừa phải
        
        this.init();
    }
    
    init() {
        this.createHearts();
        this.startHeartAnimation();
    }
    
    createHearts() {
        const initialCount = Math.min(3, this.maxHearts);  // 3 tim ban đầu
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => this.createHeart(), i * 400);
        }
    }
    
    createHeart() {
        // Limit total hearts
        if (this.container.children.length >= this.maxHearts) {
            const firstHeart = this.container.firstChild;
            if (firstHeart) this.container.removeChild(firstHeart);
        }
        
        const heart = document.createElement('div');
        
        // Random style từ 3 hiệu ứng
        const randomStyle = this.styles[Math.floor(Math.random() * this.styles.length)];
        heart.className = `floating-heart ${randomStyle}`;
        
        heart.innerHTML = this.hearts[Math.floor(Math.random() * this.hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        
        // Smaller hearts on mobile
        const minSize = this.isMobile ? 25 : 30;
        const maxSize = this.isMobile ? 40 : 45;
        heart.style.fontSize = (Math.random() * (maxSize - minSize) + minSize) + 'px';
        
        const duration = randomStyle === 'style-1' ? Math.random() * 4 + 12 :
                        randomStyle === 'style-2' ? Math.random() * 4 + 14 :
                        Math.random() * 4 + 16;
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = Math.random() * 3 + 's';
        
        this.container.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, (duration + 3) * 1000);
    }
    
    startHeartAnimation() {
        setInterval(() => this.createHeart(), this.generateInterval);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeartsEffect();
});

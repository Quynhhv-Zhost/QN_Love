class LoveWebsite {
    constructor() {
        // Fix cứng ngày yêu: 15/5/2024
        this.loveStartDate = new Date('2024-05-15');
        this.init();
    }
    
    async init() {
        await this.loadLoveStartDate();
        await this.loadBannerData();
        this.startLoveCounter();
        this.addPageAnimations();
        this.setupInteractiveEffects();
    }
    
    async loadBannerData() {
        try {
            const response = await fetch('/api/banner');
            const data = await response.json();
            
            // Load caption
            if (data.caption) {
                const captionElement = document.getElementById('bannerCaption');
                if (captionElement) {
                    captionElement.textContent = data.caption;
                }
            }
            
            // Load photo
            if (data.photo) {
                const photoElement = document.getElementById('bannerPhoto');
                if (photoElement) {
                    photoElement.src = data.photo;
                }
            }
        } catch (error) {
            console.error('Error loading banner data:', error);
        }
    }
    
    async loadLoveStartDate() {
        try {
            const response = await fetch('/api/love-date');
            const data = await response.json();
            if (data.startDate) {
                this.loveStartDate = new Date(data.startDate);
                console.log('Loaded love start date:', this.loveStartDate);
            }
        } catch (error) {
            console.error('Error loading love start date:', error);
            // Fallback to default date: 15/5/2024
            this.loveStartDate = new Date('2024-05-15');
        }
    }
    
    startLoveCounter() {
        const updateCounter = () => {
            const now = new Date();
            const timeDiff = now - this.loveStartDate;
            
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            this.animateCounter('days', days);
            this.animateCounter('hours', hours);
            this.animateCounter('minutes', minutes);
        };
        
        // Update immediately
        updateCounter();
        
        // Update every minute
        setInterval(updateCounter, 60000);
        
        // Also update every second for more accuracy
        setInterval(updateCounter, 1000);
    }
    
    animateCounter(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            const currentValue = parseInt(element.textContent) || 0;
            if (currentValue !== newValue) {
                element.textContent = newValue;
                element.classList.add('scale-in');
                setTimeout(() => {
                    element.classList.remove('scale-in');
                }, 500);
            }
        }
        
        // Cập nhật số ngày vào trái tim lớn
        if (elementId === 'days') {
            const heartDaysBig = document.getElementById('heartDaysBig');
            if (heartDaysBig) {
                heartDaysBig.textContent = newValue;
            }
        }
    }
    
    addPageAnimations() {
        const title = document.querySelector('.love-title');
        const counter = document.querySelector('.love-counter');
        if (title) title.classList.add('fade-in-down', 'delay-1');
        if (counter) counter.classList.add('fade-in-up', 'delay-2');
    }
    
    setupInteractiveEffects() {
        const title = document.querySelector('.love-title');
        if (title) {
            title.addEventListener('mouseenter', () => title.classList.add('heart-beat'));
            title.addEventListener('mouseleave', () => title.classList.remove('heart-beat'));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoveWebsite();
});

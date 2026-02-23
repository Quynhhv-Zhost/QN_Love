class GalleryEffects {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.filmStrip = document.getElementById('filmStrip');
        this.modal = document.getElementById('photoModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDate = document.getElementById('modalDate');
        this.modalDescription = document.getElementById('modalDescription');
        this.closeBtn = document.querySelector('.close');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.currentCategory = 'all';
        this.photos = [];
        this.init();
    }
    
    init() {
        this.loadPhotos();
        this.setupEventListeners();
        this.setupNavigation();
    }
    
    async loadPhotos() {
        try {
            const response = await fetch('/api/photos');
            this.photos = await response.json();
            this.renderBoth();
        } catch (error) {
            console.error('Error loading photos:', error);
            this.loadSamplePhotos();
        }
    }
    
    loadSamplePhotos() {
        this.photos = [];
        this.renderBoth();
    }
    
    renderBoth() {
        this.renderFilmStrip();
        this.renderGallery();
    }
    
    renderFilmStrip() {
        this.filmStrip.innerHTML = '';
        const filteredPhotos = this.currentCategory === 'all' 
            ? this.photos 
            : this.photos.filter(photo => photo.category === this.currentCategory);
        
        if (filteredPhotos.length === 0) {
            this.filmStrip.innerHTML = '<p style="color: #fff; padding: 40px; text-align: center;">Chưa có ảnh nào. Vào admin panel để upload ảnh! 💕</p>';
            return;
        }
        
        // Duplicate để tạo hiệu ứng cuộn liên tục
        const photosToRender = [...filteredPhotos, ...filteredPhotos];
        
        photosToRender.forEach((photo) => {
            const filmFrame = this.createFilmFrame(photo);
            this.filmStrip.appendChild(filmFrame);
        });
    }
    
    renderGallery() {
        this.gallery.innerHTML = '';
        const filteredPhotos = this.currentCategory === 'all' 
            ? this.photos 
            : this.photos.filter(photo => photo.category === this.currentCategory);
        
        if (filteredPhotos.length === 0) {
            this.gallery.innerHTML = '<p style="color: rgba(255,255,255,0.9); text-align: center; grid-column: 1/-1; padding: 40px;">Chưa có ảnh nào. Vào admin panel để upload ảnh! 💕</p>';
            return;
        }
        
        filteredPhotos.forEach((photo) => {
            const photoElement = this.createPhotoElement(photo);
            this.gallery.appendChild(photoElement);
        });
    }
    
    createFilmFrame(photo) {
        const filmFrame = document.createElement('div');
        filmFrame.className = 'film-frame';
        const safeTitle = (photo.title || '').trim();
        const infoTitleHtml = safeTitle ? `<div class="film-frame-title">${safeTitle}</div>` : '';
        filmFrame.innerHTML = `
            <img src="/uploads/${photo.filename}" alt="${safeTitle || 'Ảnh kỷ niệm'}"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2YjlkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuG9oG5oIOG7nWMgbeG7jW5nPC90ZXh0Pjwvc3ZnPg=='" >
            <div class="film-frame-info">
                ${infoTitleHtml}
                <div class="film-frame-date">${this.formatDate(photo.date)}</div>
            </div>
        `;
        filmFrame.addEventListener('click', () => this.openModal(photo));
        return filmFrame;
    }
    
    createPhotoElement(photo) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item floating-element hover-float';
        const safeTitle = (photo.title || '').trim();
        const overlayTitleHtml = safeTitle ? `<div class="photo-title">${safeTitle}</div>` : '';
        photoDiv.innerHTML = `
            <img src="/uploads/${photo.filename}" alt="${safeTitle || 'Ảnh kỷ niệm'}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2YjlkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuG9oG5oIOG7nWMgbeG7jW5nPC90ZXh0Pjwvc3ZnPg=='">
            <div class="photo-overlay">
                ${overlayTitleHtml}
                <div class="photo-date">${this.formatDate(photo.date)}</div>
            </div>
        `;
        photoDiv.addEventListener('click', () => this.openModal(photo));
        return photoDiv;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    openModal(photo) {
        this.modalImage.src = `/uploads/${photo.filename}`;
        this.modalTitle.textContent = (photo.title || '').trim();
        this.modalDate.textContent = this.formatDate(photo.date);
        this.modalDescription.textContent = photo.description || '';
        this.modal.style.display = 'block';
    }
    
    closeModal() {
        this.modal.style.display = 'none';
    }
    
    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }
    
    setupNavigation() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.renderBoth();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GalleryEffects();
});

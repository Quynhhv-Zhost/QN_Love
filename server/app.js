const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'love-website-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Static files - NO CACHE
app.use(express.static('public', {
    maxAge: 0,
    etag: false,
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// Create necessary directories
const uploadsDir = path.join(__dirname, '../public/uploads');
const dataDir = path.join(__dirname, 'data');

[uploadsDir, dataDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Data files
const photosFile = path.join(dataDir, 'photos.json');
const settingsFile = path.join(dataDir, 'settings.json');
const adminFile = path.join(dataDir, 'admin.json');

// Initialize data files
const initializeDataFiles = () => {
    if (!fs.existsSync(photosFile)) {
        fs.writeFileSync(photosFile, JSON.stringify([]));
    }
    
    if (!fs.existsSync(settingsFile)) {
        const defaultSettings = {
            loveStartDate: '2024-05-15',
            siteName: 'Our Love Story',
            bannerCaption: 'Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng. ❤️',
            bannerPhoto: '/uploads/banner.jpg'
        };
        fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
    }
    
    if (!fs.existsSync(adminFile)) {
        const defaultAdmin = {
            username: 'qnlove',
            password: bcrypt.hashSync('qnlove@123!@#', 10)
        };
        fs.writeFileSync(adminFile, JSON.stringify(defaultAdmin, null, 2));
    }
};

initializeDataFiles();

// Helper functions

const readJsonFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return [];
    }
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'));
        }
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.get('/api/photos', (req, res) => {
    const photos = readJsonFile(photosFile);
    res.json(photos);
});

app.get('/api/love-date', (req, res) => {
    const settings = readJsonFile(settingsFile);
    res.json({ startDate: settings.loveStartDate });
});

app.get('/api/banner', (req, res) => {
    const settings = readJsonFile(settingsFile);
    res.json({ 
        caption: settings.bannerCaption || 'Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng. ❤️',
        photo: settings.bannerPhoto || '/uploads/banner.jpg'
    });
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username và password là bắt buộc' });
    }
    
    const admin = readJsonFile(adminFile);
    
    if (username !== admin.username) {
        return res.status(401).json({ error: 'Thông tin đăng nhập không đúng' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Thông tin đăng nhập không đúng' });
    }
    
    const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Đăng nhập thành công' });
});

app.post('/api/admin/upload', authenticateToken, upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Không có file được upload' });
    }
    
    const { title, category, description, date } = req.body;
    
    if (!category) {
        const uploadedFilePath = path.join(uploadsDir, req.file.filename);
        if (fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
        }
        return res.status(400).json({ error: 'Danh mục là bắt buộc' });
    }
    
    // title là tùy chọn: giữ rỗng nếu người dùng không nhập, tuyệt đối không auto-fill ngày hiện tại
    const photos = readJsonFile(photosFile);
    const newPhoto = {
        id: Date.now(),
        filename: req.file.filename,
        title: (title || '').trim(),
        category,
        description: description || '',
        date: date || new Date().toISOString().split('T')[0],
        uploadedAt: new Date().toISOString()
    };
    
    photos.push(newPhoto);
    writeJsonFile(photosFile, photos);
    
    res.json({ message: 'Upload ảnh thành công', photo: newPhoto });
});

app.delete('/api/admin/photos/:id', authenticateToken, (req, res) => {
    const photoId = parseInt(req.params.id);
    const photos = readJsonFile(photosFile);
    const photoIndex = photos.findIndex(p => p.id === photoId);
    
    if (photoIndex === -1) {
        return res.status(404).json({ error: 'Không tìm thấy ảnh' });
    }
    
    const photo = photos[photoIndex];
    const filePath = path.join(uploadsDir, photo.filename);
    
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    
    photos.splice(photoIndex, 1);
    writeJsonFile(photosFile, photos);
    
    res.json({ message: 'Xóa ảnh thành công' });
});

app.put('/api/admin/love-date', authenticateToken, (req, res) => {
    const { startDate } = req.body;
    
    if (!startDate) {
        return res.status(400).json({ error: 'Ngày bắt đầu yêu là bắt buộc' });
    }
    
    const settings = readJsonFile(settingsFile);
    settings.loveStartDate = startDate;
    writeJsonFile(settingsFile, settings);
    
    res.json({ message: 'Cập nhật ngày bắt đầu yêu thành công' });
});

app.post('/api/admin/banner-photo', authenticateToken, upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Không có file được upload' });
    }
    
    const settings = readJsonFile(settingsFile);
    
    // Delete old banner photo if exists
    if (settings.bannerPhoto && settings.bannerPhoto !== '/uploads/banner.jpg') {
        const oldPhotoPath = path.join(__dirname, '../public', settings.bannerPhoto);
        if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
        }
    }
    
    settings.bannerPhoto = `/uploads/${req.file.filename}`;
    writeJsonFile(settingsFile, settings);
    
    res.json({ 
        message: 'Upload ảnh banner thành công',
        photo: settings.bannerPhoto
    });
});

app.put('/api/admin/banner-caption', authenticateToken, (req, res) => {
    const { caption } = req.body;
    
    if (!caption) {
        return res.status(400).json({ error: 'Caption là bắt buộc' });
    }
    
    const settings = readJsonFile(settingsFile);
    settings.bannerCaption = caption;
    writeJsonFile(settingsFile, settings);
    
    res.json({ message: 'Cập nhật caption thành công' });
});

app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    const photos = readJsonFile(photosFile);
    const settings = readJsonFile(settingsFile);
    
    const stats = {
        totalPhotos: photos.length,
        categories: {
            couple: photos.filter(p => p.category === 'couple').length,
            food: photos.filter(p => p.category === 'food').length,
            travel: photos.filter(p => p.category === 'travel').length
        },
        recentPhotos: photos.slice(-5).reverse()
    };
    
    res.json({
        stats,
        settings,
        photos: photos.reverse()
    });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/dashboard.html'));
});

app.get('/admin/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/upload.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File quá lớn (tối đa 10MB)' });
        }
    }
    
    console.error('Server error:', error);
    res.status(500).json({ error: 'Lỗi server' });
});

app.listen(PORT, () => {
    console.log(`🌹 Love Website đang chạy tại http://localhost:${PORT}`);
    console.log(`💕 Admin panel: http://localhost:${PORT}/admin`);
    console.log(`📝 Tài khoản mặc định: admin / admin123`);
});

module.exports = app;

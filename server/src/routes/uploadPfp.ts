import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';

const router = Router();
const MAX_UPLOAD_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || '') || 15 * 1024 * 1024; // default 15MB
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_SIZE } });
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const cloudinary = require('cloudinary');

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /upload-pfp
// Expects multipart/form-data with field `profileImage`
router.post('/', (req, res, next) => upload.single('profileImage')(req, res, (err: any) => {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ success: false, error: `File too large. Max size ${Math.round(MAX_UPLOAD_SIZE / 1024 / 1024)} MB` });
        return next(err);
    }
    next();
}), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

        if (!ALLOWED_MIME.has(req.file.mimetype)) {
            return res.status(400).json({ success: false, error: 'Unsupported image type. Allowed: jpeg, png, webp' });
        }
        if (req.file.size > MAX_UPLOAD_SIZE) {
            return res.status(413).json({ success: false, error: `File too large. Max size ${Math.round(MAX_UPLOAD_SIZE / 1024 / 1024)} MB` });
        }

        // Optimize: convert to WebP, resize, and upload
        try {
            const optimized = await sharp(req.file.buffer)
                .rotate()
                .resize({ width: 1024, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();

            const dataUri = `data:image/webp;base64,${optimized.toString('base64')}`;
            const result = await cloudinary.v2.uploader.upload(dataUri, {
                folder: 'pfp',
                resource_type: 'image',
            });
            return res.json({ success: true, secure_url: result.secure_url, public_id: result.public_id });
        } catch (err) {
            console.error('Optimization/upload error:', err);
            // fallback to original upload
            const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const result = await cloudinary.v2.uploader.upload(dataUri, {
                folder: 'pfp',
                resource_type: 'image',
            });
            return res.json({ success: true, secure_url: result.secure_url, public_id: result.public_id });
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ success: false, error: 'Failed to upload image' });
    }
});

export default router;

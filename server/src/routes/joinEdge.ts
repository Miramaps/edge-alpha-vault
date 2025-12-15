import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { db } from '../firebaseAdmin';

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

// POST /api/join-edge
router.post('/', (req, res, next) => upload.single('profileImage')(req, res, (err: any) => {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ success: false, error: `File too large. Max size ${Math.round(MAX_UPLOAD_SIZE / 1024 / 1024)} MB` });
        return next(err);
    }
    next();
}), async (req, res) => {
    try {
        const { channelName, twitterHandle, discordHandle, maxMembers, markets, polymarketWallet } = req.body;
        let profileImageUrl = null;

        if (req.file) {
            if (!ALLOWED_MIME.has(req.file.mimetype)) {
                return res.status(400).json({ success: false, error: 'Unsupported image type. Allowed: jpeg, png, webp' });
            }
            if (req.file.size > MAX_UPLOAD_SIZE) {
                return res.status(413).json({ success: false, error: `File too large. Max size ${Math.round(MAX_UPLOAD_SIZE / 1024 / 1024)} MB` });
            }

            // Server-side optimization: resize and recompress using sharp
            try {
                const optimizedBuffer = await sharp(req.file.buffer)
                    .rotate()
                    .resize({ width: 1024, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer();

                const dataUri = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
                const result = await cloudinary.v2.uploader.upload(dataUri, {
                    folder: 'profileImages',
                    resource_type: 'image',
                });
                profileImageUrl = result.secure_url;
            } catch (optErr) {
                console.error('Image optimization/upload error:', optErr);
                // Fallback: upload original file if optimization fails
                const fallbackDataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                const result = await cloudinary.v2.uploader.upload(fallbackDataUri, {
                    folder: 'profileImages',
                    resource_type: 'image',
                });
                profileImageUrl = result.secure_url;
            }
        }

        const ref = db.ref('joinEdgeApplications');

        // Create a URL/key-safe slug from channelName to use as the record ID
        const makeSlug = (s: string) => {
            return s
                .toString()
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-') // spaces to dashes
                .replace(/[^a-z0-9\-]/g, '') // remove invalid chars
                .replace(/-+/g, '-'); // collapse dashes
        };

        let key = makeSlug(channelName || `channel-${Date.now()}`);
        if (!key) key = `channel-${Date.now()}`;

        // If the key already exists, append a timestamp to ensure uniqueness
        let keyRef = ref.child(key);
        const snapshot = await keyRef.once('value');
        if (snapshot.exists()) {
            key = `${key}-${Date.now()}`;
            keyRef = ref.child(key);
        }

        await keyRef.set({
            channelName,
            twitterHandle,
            discordHandle,
            maxMembers,
            markets,
            polymarketWallet,
            profileImageUrl,
            Status: 'Pending',
            createdAt: new Date().toISOString(),
        });

        res.status(200).json({ success: true, id: key });
    } catch (error) {
        console.error('joinEdge submission error:', error);
        res.status(500).json({ success: false, error: 'Failed to submit application.' });
    }
});

export default router;

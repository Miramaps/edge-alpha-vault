import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

function loadServiceAccount() {
    // Option 1: path to service.json file via env
    const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (configuredPath) {
        const candidates = [
            configuredPath,
            path.resolve(process.cwd(), configuredPath),
            path.resolve(__dirname, '..', '..', configuredPath),
        ];
        for (const p of candidates) {
            try {
                if (fs.existsSync(p)) {
                    const raw = fs.readFileSync(p, 'utf8');
                    return JSON.parse(raw);
                }
            } catch (err) {
                // ignore and try next
            }
        }
        // none found — include helpful diagnostics
        // continue to other options (BASE64 or individual fields)
    }

    // Option 2: base64-encoded JSON in env
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (b64) {
        const json = Buffer.from(b64, 'base64').toString('utf8');
        return JSON.parse(json);
    }

    // Option 3: individual fields (legacy)
    if (process.env.FIREBASE_PRIVATE_KEY) {
        return {
            type: 'service_account',
            project_id: process.env.FIREBASE_PROJECT_ID || 'edge-c45aa',
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        };
    }

    throw new Error('No Firebase service account configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_BASE64.');
}

let app: any;
if (!getApps().length) {
    const serviceAccount = loadServiceAccount();

    // Determine databaseURL: prefer explicit env, otherwise try to derive from project_id
    const envDbUrl = process.env.FIREBASE_DATABASE_URL;
    let databaseURL = envDbUrl;
    if (!databaseURL && serviceAccount && serviceAccount.project_id) {
        // Many new projects use the -default-rtdb suffix, fall back to that pattern
        databaseURL = `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`;
    }

    if (!databaseURL) {
        throw new Error('No Firebase Database URL found. Set FIREBASE_DATABASE_URL in env or include a service account with a project_id.');
    }

    app = initializeApp({
        credential: cert(serviceAccount as any),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'edge-c45aa.appspot.com',
        databaseURL,
    });
} else {
    app = getApps()[0];
}

const db = getDatabase(app);
const bucket = getStorage(app).bucket();

export { app, bucket, db };


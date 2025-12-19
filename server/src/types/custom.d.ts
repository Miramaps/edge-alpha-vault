// Allow imports of modules without types and extend Express Request for multipart uploads
declare module 'multer';

declare global {
    namespace Express {
        interface Request {
            // multer places the uploaded file(s) here when using memoryStorage
            file?: any;
            files?: any;
        }
    }
}

export { };


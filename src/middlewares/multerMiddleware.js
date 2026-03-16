import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 3, // cv, dbs, profile_picture
    },
    fileFilter: (req, file, cb) => {
        const { fieldname, mimetype } = file;

        // PDF fields
        if (fieldname === "cv" || fieldname === "dbs" || fieldname === "pdf") {
            if (mimetype !== "application/pdf") {
                return cb(new Error(`${fieldname} must be a PDF file`));
            }
            return cb(null, true);
        }

        // Video files
        if (fieldname === "video") {
            if (!mimetype.startsWith("video/")) {
                return cb(new Error("File must be a valid video format"));
            }

            return cb(null, true);
        }

        // Audio files
        if (fieldname === "audio") {
            if (!mimetype.startsWith("audio/")) {
                return cb(new Error("File must be a valid audio format"));
            }

            return cb(null, true);
        }

        // Images only
        if (fieldname === "profile_picture" || fieldname === "image") {
            if (!mimetype.startsWith("image/")) {
                return cb(new Error("File must be a valid image format"));
            }

            return cb(null, true);
        }

        // Any other field is invalid
        return cb(new Error("Invalid file field"));
    },
});

const multerHandler = (req, res, next) => {
    const multerFields = upload.fields([
        { name: 'cv', maxCount: 1 },
        { name: 'dbs', maxCount: 1 },
        { name: 'profile_picture', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]);

    multerFields(req, res, (err) => {
        if (err) {
            // Multer error (file too large, too many files, etc.)
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            }

            // Custom fileFilter error
            return res.status(400).json({ success: false, message: err.message });
        }

        next(); // proceed to next middleware
    });
};

export {
    multerHandler
}
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
        if (fieldname === "cv" || fieldname === "dbs") {
            if (mimetype !== "application/pdf") {
                return cb(new Error(`${fieldname} must be a PDF file`));
            }
            return cb(null, true);
        }

        // Profile picture (images only)
        if (fieldname === "profile_picture") {
            const allowedImageTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];

            if (!allowedImageTypes.includes(mimetype)) {
                return cb(new Error("Profile picture must be an image (jpg, png, webp)"));
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
        { name: 'profile_picture', maxCount: 1 }
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
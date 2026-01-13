const parseMultipartJSON = (fields = []) => {
    return (req, res, next) => {
        for (const field of fields) {
            if (typeof req.body?.[field] === 'string') {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: `${field} must be valid JSON`,
                    });
                }
            }
        }
        next();
    };
}

export {
    parseMultipartJSON,
}
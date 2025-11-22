import vine from '@vinejs/vine'

/**
 * Generic validator middleware for Vine
 * @param {Object} schemaObj - { body, query, params, headers }
 */
function validate(schemaObj) {
    return async (req, res, next) => {
        try {
            for (const key of ['body', 'query', 'params', 'headers']) {
                const schema = schemaObj[key];
                if (schema) {
                    const validatedData = await vine.validate(schema, req[key]);
                    // Override with validated data (except query as it's usually read-only)
                    if (key !== 'query') req[key] = validatedData;
                }
            }
            next();
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.errors || err.message,
            });
        }
    };
}

export {
    validate,
}
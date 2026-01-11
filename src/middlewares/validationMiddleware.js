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
                    const validatedData = await vine.validate({ schema, data: req[key] });
                    // Override with validated data (except query as it's usually read-only)
                    if (key !== 'query') req[key] = validatedData;
                }
            }
            next();
        } catch (err) {
            if (err.code === 'E_VALIDATION_ERROR') {
                return res.status(422).json({
                    success: false,
                    messages: err.messages.map(e => e.message)
                })
            }

            // fallback for non-validation errors
            return res.status(500).json({
                success: false,
                message: err.message || 'Internal server error',
            });
        }
    };
}

export {
    validate,
}
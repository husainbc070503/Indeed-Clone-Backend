const ValidateInput = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        const err = {
            status: 400,
            message: error?.errors[0]?.message || "Validation Error"
        }

        next(err);
    }
}

export default ValidateInput;
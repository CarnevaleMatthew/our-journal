const Joi = require('joi');
const ExpressError = require('../helpers/ExpressError');

const validateEntry = (req, res, next) => {
    const entrySchema = Joi.object({
        title: Joi.string().required().min(3),
        body: Joi.string().required().min(5),
        status: Joi.string().required()
    })
    const {error} = entrySchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports = validateEntry;
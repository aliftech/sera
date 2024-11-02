import { body } from "express-validator";

const ValidateEmail = [
    body('to')
        .isEmail().withMessage('To field must a valid email address.')
        .notEmpty().withMessage('To field is required.'),
    
    body('subject')
        .notEmpty().withMessage('Subject field is required.'),
    
    body('text')
        .notEmpty().withMessage('Text field is required'),
];

export { ValidateEmail };
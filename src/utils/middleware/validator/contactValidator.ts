import { body } from "express-validator";

const validateContact = [
    body('fullname')
        .notEmpty().withMessage('Fullname is required.'),
    
    body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Email must contain a valid email address'),
    
    body('phone')
        .notEmpty().withMessage('Phone is required.')
        .isNumeric().withMessage('Phone must a numbers.'),
    
    body('address')
        .isAlphanumeric().withMessage('Address must contain an alpha numeric.')
]

export { validateContact };
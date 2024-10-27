const { check } = require('express-validator');

exports.signupValidator = [
    check('username', 'Name is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password must be  greater than 6 character , and cotains at least one  Uppercase , one lowercase , one number and one character').not().isEmpty()
    .isStrongPassword({
        minLength:6,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
    })
];


exports.loginValidator = [
    check('email', 'Enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password is required').not().isEmpty()
];

exports.updateProfileValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('mobile' , "Mobible Number should contains 10 digits ").isLength({
        min: 10 ,
        max: 10
    }),
];



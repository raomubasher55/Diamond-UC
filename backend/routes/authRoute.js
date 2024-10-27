const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const { signupValidator, loginValidator, updateProfileValidator  } = require('../helper/validator');
const { isLogined } = require('../middlewires/auth');  // Correctly destructure isLogined

router.use(express.json());

router.post('/register', signupValidator, userController.signupUser);
router.post('/login', loginValidator, userController.loginUser);

// Authenticated routes
router.get('/profile', isLogined, userController.userProfile);
router.post('/updateprofile', isLogined, updateProfileValidator, userController.updateProfile);
router.get('/logout', isLogined, userController.logout);



module.exports = router;

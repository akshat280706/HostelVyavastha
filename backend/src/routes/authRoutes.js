const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');


// ---------------- ROUTES ----------------
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);


module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');
// const { userValidation } = require('../middleware/validationMiddleware');

// router.post('/register', userValidation.register, registerUser);
// router.post('/login', userValidation.login, loginUser);
// router.get('/me', protect, getMe);
// router.post('/logout', protect, logoutUser);

// module.exports = router;
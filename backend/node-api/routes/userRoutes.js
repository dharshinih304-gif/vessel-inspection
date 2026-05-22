const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getCompanies } = require('../controllers/UserController');
const { protect, authorize, protectSuperadmin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, authorize('ADMIN'), getUsers);
router.get('/superadmin/companies', protect, protectSuperadmin, getCompanies);

module.exports = router;

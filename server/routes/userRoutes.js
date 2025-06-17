const express = require('express');
const router = express.Router();
const {getAllUsers} = require('../controllers/authController');

router.get('/', getAllUsers);

module.exports = router;
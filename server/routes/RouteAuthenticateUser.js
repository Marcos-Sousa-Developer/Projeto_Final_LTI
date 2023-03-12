const express = require('express');
const router = express.Router(); 
const authenticate = require('../controllers/AuthController');

//Sign in user
router.post('/signIn', authenticate.signIn) 

//Verify user type
router.get('/userType', authenticate.userType) 

module.exports = router
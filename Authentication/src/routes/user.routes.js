const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    googleSuccess,
} = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');


router.post('/register', register);
router.get('/verify', verifyEmail); 
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);


router.get('/protected', authenticate, (req,res)=>{
    res.status(200).json({message: "Welcome to the protected route", user:req.user})
})

router.get('/admin', authenticate, authorize('admin'),(req,res)=>{
    res.status(200).json({message: "Welcome to the admin route", user:req.user})
})


module.exports = router;


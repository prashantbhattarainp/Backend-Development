const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const sendEmail = (email, link) => {
    console.log(`Sending email to ${email} with link: ${link}`);
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // generate token
        const token = crypto.randomBytes(32).toString('hex');

        // create user
        await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken: token
        });

        const link = `http://localhost:8000/auth/verify?token=${token}`;

        sendEmail(email, link);

        res.status(201).json({ message: "Registered successfully" });

    } catch (error) {
        console.error("ERROR:", error.message); 
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const verifyEmail = async(req,res)=>{
    const token = req.query.token;
    const user = await User.findOne({verificationToken: token})

    if(!user){
        return res.status(400).json({message: "Invalid token"})
    }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({message:"Email Verified"});


}

const login = async(req, res)=>{
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"User doesnot exist"})
    }

    if(!user.isVerified){
        return res.status(400).json({ message: "Verify your email first"})
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched){
        return res.status(400).json({message:"Invalid Credentials"})
    }

    const token = await jwt.sign(
        {id:user._id, role:user.role, email:user.email},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.status(200).json({message: "Login Success", token, user})

}

const forgotPassword = async(req, res) =>{
    const {email} = req.body

    if(!email){
        return res.status(400).json({message: "Email not found broo!!!"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000

    await user.save()
    const link = `http://localhost:8000/auth/resetPassword?token=${token}`
    sendEmail(email, link)

    res.status(200).json({message: "Reset Password Link send"})

}

const resetPassword = async(req, res)=>{
    const {newPassword, token} = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: {$gt: Date.now()}
    })

    if(!user){
        return res.status(400).json({message:"Invalid/ Expired Token"});
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry= null;
    await user.save()

    res.status(200).json({message:"Password changed Successfully"})
}

const googleSuccess = async(req, res)=>{
    const token = await jwt.sign(
        {id: req.user._id, role: req.user.role, email: req.user.email},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.json({token, user:req.user})
}

module.exports = {register, verifyEmail, login, forgotPassword, resetPassword, googleSuccess};
const jwt = require('jsonwebtoken')

const authenticate = async(req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;
        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({message:"Invalid Token"})
    }
}

const authorize = (...roles) =>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Forbidden"})
        }
        next();
    }
}

module.exports = {authenticate, authorize}
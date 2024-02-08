const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    

    if(!authorization) {
        return res.status(401).json({
            errors: ['Login required']
        })
    }

    const [ token ] = authorization.split(' ');

    try{
        const dados = jwt.verify(token, process.env.TOKEN_SECRET);
        const {id, email} = dados

        const user = await User.findOne({
            where: {
                id,
                email
            }
        });


        if(!user) {
            return res.status(401).json({
                errors: ['Invalid User']
            })
        }
        req.user = user
        return next()
    }catch(e){
        console.log(e)
        return res.status(401).json({
            errors: ['Token expired or invalid, please Login again']
        })
    }
}


const isAdmin = async(req, res, next) => {
    try{
        const {email} = req.user;
        const adminUser = await User.findOne({ email });
        if(adminUser.role !== "admin"){
            throw new Error('You are not admin')
        }else{
            next()
        }

    }catch(e){
        throw new Error(e)
    }
}

module.exports = { authMiddleware, isAdmin }
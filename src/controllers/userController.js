const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const asynchandler = require('express-async-handler')

//create a user
const createUser = asynchandler(async(req, res) => {
    try{
        const newUser =  await User.create(req.body);
        return res.json(newUser);
    }catch(e){
        return res.status(400).json({
            errors: e.errors.map((err) => err.message)
        });
    }
});

const loginUser = asynchandler(async(req, res) => {
    try{
        const {email, password} = req.body;
        //check if user exist  or not
        const user = await User.findOne({where: {email}});

        if(!user) return res.status(401).json({
            errors: ['Invalid Credentials']
        })

        if(!await(User.prototype.passwordIsValid(password, user.password_hash))) return res.status(401).json({
            errors: [' Invalid Credentials']
        })


        const refreshToken = await generateRefreshToken ({id: user.id, email:user.email})
        const updateUser = await User.findByPk(user.id)
        updateUser.update({
            refreshToken: refreshToken,
        })

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 1000,
        })

        return res.json({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
            token: generateToken({id: user.id, email:user.email})
        })
    }catch(e){
        console.log(e)
    }
    
});

//handle refresh

const handleRefreshoken = asynchandler( async (req, res) => {
    try{
        const cookie =  req.cookies;
        if(!cookie.refreshToken) throw new Error('No refresh token in cookie')
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({where: {refreshToken} });
        if(!user)  throw new Error('No refresh token present in db or not matched')
        jwt.verify(refreshToken,process.env.TOKEN_SECRET,(async (err, decoded) => {
            if(err || user.id !== decoded.id) {
                throw new Error['There is someting Wrong with refresh token']
            }
            const accessToken = await generateRefreshToken ({id: user.id, email:user.email});
            res.json({ accessToken })
        }))
        
    }catch(e){
        throw new Error (e)
    }
});


//logout functionality

const logOut = asynchandler(async(req, res) => {
    const cookie = req.cookies;
    if(!cookie.refreshToken) throw new Error('No refresh token in cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({where: {refreshToken} });
    if(!user){
        res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: true,
        });

    return res.sendStatus(204); //forbiden
    }

    const refreshget = await User.findOne({where: {refreshToken}})
    refreshget.update({
        refreshToken: "",
    });
    res.clearCookie('refreshToken',{
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);
});


const getAllUser = asynchandler(async(req, res) => {
    try{
        const  getUser = await User.findAll()
        res.json(getUser)
    }catch(e){
        throw new Error(e)
    }
})


const singleUser = asynchandler(async(req, res) => {
    try{
        const userId = req.params.id

        const id_ = req.params.id
        if(!userId) {
            return res.status(400).json({
                errors: ['Invalid id']
            })
        }

        if(!Number(userId)){
            return res.status(400).json({
                errors: ['Invalid id']
            });
        }

        const getUser = await User.findByPk(userId)
        res.json(getUser)
    }catch(e){
        console.log(e)
    }
});

const deleteUser = asynchandler(async(req, res) => {
    try{
        const userId = req.params.id

        const id_ = req.params.id
        if(!userId) {
            return res.status(400).json({
                errors: ['Invalid id']
            })
        }

        if(!Number(userId)){
            return res.status(400).json({
                errors: ['Invalid id']
            });
        }

        const getUser = await User.findByPk(userId)
        getUser.destroy()
        res.json({
            message: 'User deleted'
        })
    }catch(e){
        console.log(e)
    }
});


const updateUser = asynchandler(async(req, res) => {
    try{
        const userId = req.user.id

        if(!userId) {
            return res.status(400).json({
                errors: ['Invalid id']
            })
        }

        if(!Number(userId)){
            return res.status(400).json({
                errors: ['Invalid id']
            });
        }

        const getUser = await User.findByPk(userId)
        
        const getnewUser = await getUser.update(req.body)
        res.json({
            getnewUser,
            message: 'User updated'
        })
    }catch(e){
        console.log(e)
    }
})


const blockUser = asynchandler(async (req, res) => {
    const {id} = req.params;

    if(!id) {
        return res.status(400).json({
            errors: ['Invalid id']
        })
    }

    if(!Number(id)){
        return res.status(400).json({
            errors: ['Invalid id']
        });
    }

    try{
        const block = await User.findByPk(id)
        block.update({
            isBlocked: true
        })

        res.json({
            message: 'User blocked'
        })
    }catch(e){
        throw new Error(e)
    }
})

const unblockUser = asynchandler(async (req, res) => {
    const {id} = req.params;

    if(!id) {
        return res.status(400).json({
            errors: ['Invalid id']
        })
    }

    if(!Number(id)){
        return res.status(400).json({
            errors: ['Invalid id']
        });
    }

    try{
        const unblock = await User.findByPk(id)
        unblock.update({
            isBlocked: false
        })

        res.json({
            message: 'User unblocked'
        })
    }catch(e){
        throw new Error(e)
    }
});


module.exports = { 
    createUser, 
    loginUser, 
    getAllUser, 
    singleUser, 
    deleteUser, 
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshoken,
    logOut,
};
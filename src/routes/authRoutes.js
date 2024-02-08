const express = require('express');
const router = express.Router();

const { createUser, 
        loginUser, 
        getAllUser, 
        singleUser, 
        deleteUser, 
        updateUser, 
        blockUser, 
        unblockUser, 
        handleRefreshoken,
        logOut,
} = require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/all-users', getAllUser)
router.get('/refresh', handleRefreshoken)
router.get('/logout', logOut)
router.get('/:id',authMiddleware,isAdmin ,singleUser)
router.delete('/:id', deleteUser)
router.put('/edit-user',authMiddleware , updateUser)
router.put('/block-user/:id',authMiddleware , isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware , isAdmin, unblockUser)


module.exports = router;
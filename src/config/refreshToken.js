const jwt =  require('jsonwebtoken')

const generateRefreshToken = async (id, email) => {
    return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: "3d" })
}

module.exports = { generateRefreshToken }
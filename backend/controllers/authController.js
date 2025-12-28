const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// generating json web tokens
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// @desc register a new User
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body

        // check if useralready exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        // determine user role. admin if correct token is provided
        let role = "member"
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin"
        }

        // optimzed method than the nested callbacks
        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        })
        
        // send/return user data
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// @desc login a User
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ message: "Invalid credentials"})
        }
        
        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials"})
        }

        // send/return user data w jwt
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// @desc get user profile
// @route GET /api/auth/profile
// @access Private requires jwt
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({ message: "User not found"})
        }
        return res.json(user)

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
} 

// @desc update user profile
// @route PUT /api/auth/profile
// @access Private requires jwt 
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if(!user){
            return res.status(404).json({ message: "User not found"})
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile }
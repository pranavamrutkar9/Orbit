const Action = require("../models/Action")
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// @desc get all users
// @route GET /api/users/
// @access private (admin)
const getUsers = async (req, res)=>{
    try {
        const users = await User.find({role: "member"}).select("-password")

        const usersWithActionCounts = await Promise.all(
            users.map(async (user)=>{
                const pendingActions = await Action.countDocuments({
                    assignedTo: user._id,
                    status: "pending"
                })
                const inProgressActions = await Action.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress"
                })
                const completedActions = await Action.countDocuments({
                    assignedTo: user._id,
                    status: "Completed"
                })

                return {
                    ...user._doc, // user object is not added insted user document is added
                    pendingActions,
                    inProgressActions,
                    completedActions
                }
            })
        )

        res.json(usersWithActionCounts)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// @desc    get userr by id
// @route   GET /api/users/:id
// @access  private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// @desc    delete user by id
// @route   DELETE /api/users/:id
// @access  private (admin)
const deleteUser = async (req, res) => {
    try {
        // prevent admin from deleting themselves
        if (req.user && req.user.id === req.params.id) {
            return res.status(400).json({ message: "Admins cannot delete themselves" })
        }

        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({ message: "User removed" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = { getUsers, getUserById, deleteUser }
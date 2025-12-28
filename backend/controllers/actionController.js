const Aciton = require("../models/Action")

// @desc    get all actions (admin: all, user: assigned)
// @route   GET /api/actions/
// @access private
const getActions = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    get action by id
// @route   GET /api/actions/:id
// @access private
const getActionById = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    create new action - admin only
// @route   POST /api/actions/
// @access private - admin only
const createAction = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// @desc    update action details
// @route   PUT /api/actions/:id
// @access private
const updateAction = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    delete action
// @route   DELETE /api/actions/:id
// @access private - admin only
const deleteAction = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    update action status
// @route   PUT /api/actions/:id/status
// @access private
const updateActionStatus = async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    update action checklist
// @route   PUT /api/actions/:id/acts
// @access private
const updateActChecklist = async(req, res)=>{
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    dashboard data - admin only
// @route   GET /api/actions/dashboard-data
// @access private 
const getDashboardData = async(req, res)=>{
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    dashboard data - user specific
// @route   GET /api/actions/user-dashboard-data
// @access private
const getUserDashboardData = async(req, res)=>{
    try {

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

module.exports = {
    getActions,
    getActionById,
    createAction,
    updateAction,
    deleteAction,
    updateActionStatus,
    updateActChecklist,
    getDashboardData,
    getUserDashboardData
}
const Action = require("../models/Action")

// @desc    get all actions (admin: all, user: assigned)
// @route   GET /api/actions/
// @access private
const getActions = async(req, res)=>{
    try {
        const {status} = req.query

        // Fetch all actions first, then filter in memory based on calculated status
        let actions;
        if(req.user.role === "admin"){
            actions = await Action.find({}).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        } else{
            actions = await Action.find({ assignedTo: req.user.id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        }

        // add completed act checklist count
        const processedActions = actions.map((action)=>{
                const completedCount = action.actChecklist.filter(
                    (item)=>item.completed
                ).length
                const totalItems = action.actChecklist.length
                const progress = totalItems > 0 ? Math.round((completedCount/totalItems)*100) : 0

                let derivedStatus = action.status
                if(progress === 100){
                    derivedStatus = "Completed"
                } else if(progress > 0){
                    derivedStatus = "In Progress"
                } else {
                    derivedStatus = "Pending"
                }

                return { 
                    ...action._doc, 
                    completedActCount: completedCount, 
                    progress, 
                    status: derivedStatus 
                }
            })

        // status summary count
        const allActions = processedActions.length
        const pendingActions = processedActions.filter((a)=>a.status === "Pending").length
        const inProgressActions = processedActions.filter((a)=>a.status === "In Progress").length
        const completedActions = processedActions.filter((a)=>a.status === "Completed").length

        // Filter based on requested status
        let filteredActions = processedActions
        if(status){
            filteredActions = processedActions.filter((a)=>a.status === status)
        }

        res.json({
            actions: filteredActions,
            statusSummary: {
                allActions,
                pendingActions,
                inProgressActions,
                completedActions
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    get action by id
// @route   GET /api/actions/:id
// @access private
const getActionById = async(req, res)=>{
    try {
        const action = await Action.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )
        if(!action){
            return res.status(404).json({ message: "Action not found" })
        }

        res.json(action)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    create new action - admin only
// @route   POST /api/actions/
// @access private - admin only
const createAction = async(req, res)=>{
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            actChecklist
        } = req.body

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({ message: "Assigned to must be an array" })
        }

        const action = await Action.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user.id,
            actChecklist,
            attachments
        })

        res.status(201).json({message: "Action created successfully", action })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

// @desc    update action details
// @route   PUT /api/actions/:id
// @access private
const updateAction = async(req, res)=>{
    try {
        const action = await Action.findById(req.params.id)

        if(!action) return res.status(404).json({ message: "Action not found" })

        action.title = req.body.title || action.title
        action.description = req.body.description || action.description
        action.priority = req.body.priority || action.priority
        action.dueDate = req.body.dueDate || action.dueDate
        action.actChecklist = req.body.actChecklist || action.actChecklist
        action.attachments = req.body.attachments || action.attachments

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({ message: "Assigned to must be an array" })
            }
            action.assignedTo = req.body.assignedTo
        }

        const completedCount = action.actChecklist.filter((item)=>item.completed).length
        const totalItems = action.actChecklist.length
        action.progress = totalItems > 0 ? Math.round((completedCount/totalItems)*100) : 0

        if(action.progress === 100){
            action.status = "Completed"
        } else if(action.progress > 0){
            action.status = "In Progress"
        } else{
            action.status = "Pending"
        }

        const updatedAction = await action.save()
        res.json({message: "Action updated successfully", updatedAction})
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    delete action
// @route   DELETE /api/actions/:id
// @access private - admin only
const deleteAction = async(req, res)=>{
    try {
        const action = await Action.findById(req.params.id)

        if(!action){
            res.status(404).json({ message: "Action not found" })
        }

        await action.deleteOne()
        res.json({ message: "Action deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
} 
 
// @desc    update action status
// @route   PUT /api/actions/:id/status
// @access private
const updateActionStatus = async(req, res)=>{
    try {
        const action = await Action.findById(req.params.id)
        if(!action) {
            return res.status(404).json({ message: "Action not found" })
        }

        const isAssignedTo = action.assignedTo.some(
            (userId)=>userId.toString() === req.user._id.toString()
        )
        // checks if any of the assigned to user is logged in - security check

        // not assigned user and not even admin
        if(!isAssignedTo && req.user.role !== "admin"){
            return res.status(403).json({ message: "Not Authorized" })
        }

        action.status = req.body.status
        if(action.status === "Completed"){
            action.actChecklist.forEach((item)=>{
                item.completed = true
            })
            action.progress=100;
        }
        const updatedAction = await action.save()
        res.json({message: "Action updated successfully", updatedAction})

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    update action checklist
// @route   PUT /api/actions/:id/acts
// @access private
const updateActChecklist = async(req, res)=>{
    try {
        const { actChecklist } = req.body
        const action = await Action.findById(req.params.id)

        if(!action) return res.status(404).json({ message: "Action not found" })

        if(!action.assignedTo.includes(req.user._id) && req.user.role !== "admin"){
            return res.status(403).json({ message: "Not Authorized" })
        }

        action.actChecklist = actChecklist

        //update progress based on act checklist
        const completedCount = action.actChecklist.filter(
            (item)=>item.completed
        ).length
        const totalItems = action.actChecklist.length
        action.progress = totalItems>0 ? Math.round((completedCount/action.actChecklist.length)*100) : 0

        // auto mark action as completed
        if(action.progress === 100){
            action.status = "Completed"
        } else if(action.progress > 0){
            action.status = "In Progress"
        } else{
            action.status = "Pending"
        }

        await action.save()
        const updatedAction = await Action.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )
        res.json({message: "Action updated successfully", updatedAction})
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    dashboard data - admin only
// @route   GET /api/actions/dashboard-data
// @access private 
const getDashboardData = async(req, res)=>{
    try {
        // fetch statistics
        const totalActions = await Action.countDocuments()
        const pendingActions = await Action.countDocuments({ status: "Pending" })
        const completedActions = await Action.countDocuments({ status: "Completed" })
        const overDueActions = await Action.countDocuments({
            status: {$ne: "Completed"},
            dueDate: { $lt: new Date() }
        })

        // ensure all statuses are included
        const actionStatuses = ["Pending", "In Progress", "Completed"]
        const actionDistributionRaw = await Action.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])
        const actionDistribution = actionStatuses.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = 
                actionDistributionRaw.find((item)=>item._id === status)?.count || 0
            return acc
        }, {})

        // ensure all priorities are included
        const actionPriorities = ["High", "Medium", "Low"]
        const actionPriorityLevelsRaw = await Action.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ])
        const actionPriorityLevels = actionPriorities.reduce((acc, priority)=>{
            acc[priority] = 
                actionPriorityLevelsRaw.find((item)=>item._id === priority)?.count || 0
            return acc
        },{})

        // fetch recent 10 actions
        const recentActions = await Action.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt")

        res.status(200).json({
            statistics: {
                totalActions,
                pendingActions,
                completedActions,
                overDueActions
            },
            charts: {
                actionDistribution,
                actionPriorityLevels
            },
            recentActions
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}
 
// @desc    dashboard data - user specific
// @route   GET /api/actions/user-dashboard-data
// @access private
const getUserDashboardData = async(req, res)=>{
    try {
        const userId = req.user._id

        const totalActions = await Action.countDocuments({ assignedTo: userId })
        const pendingActions = await Action.countDocuments({assignedTo: userId, status: "Pending"})
        const completedActions = await Action.countDocuments({assignedTo: userId, status: "Completed"})
        const overDueActions = await Action.countDocuments({
            assignedTo: userId,
            status: {$ne: "Completed"},
            dueDate: { $lt: new Date() }
        })

        // action distribution by status
        const actionStatuses = ["Pending", "In Progress", "Completed"]
        const actionDistributionRaw = await Action.aggregate([
            { $match: { assignedTo: userId }},
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ])
        const actionDistribution = actionStatuses.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g, "")
            acc[formattedKey] = 
                actionDistributionRaw.find((item) => item._id === status)?.count || 0
            return acc
        }, {})
        actionDistribution["All"]=totalActions

        // action distribution by priority
        const actionPriorities = ["High", "Medium", "Low"];
        const actionPriorityLevelsRaw = await Action.aggregate([
            { $match: { assignedTo: userId }},
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ])

        const actionPriorityLevels = actionPriorities.reduce((acc, priority)=>{
            acc[priority] = 
                actionPriorityLevelsRaw.find((item)=>item._id === priority)?.count || 0
            return acc
        }, {})

        // fetch recent 10 actions
        const recentActions = await Action.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt")

        res.status(200).json({
            statistics: {
                totalActions,
                pendingActions,
                completedActions,
                overDueActions
            },
            charts: {
                actionDistribution,
                actionPriorityLevels
            },
            recentActions
        })
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
const Action = require("../models/Action")
const User = require("../models/User")
const excelJS = require("exceljs")


// @desc    export all actions
// @route   GET /api/reports/export/actions
// @access  private - admin only
const exportActionReports = async(req, res)=>{
    try {
        const actions = await Action.find().populate(
            "assignedTo",
            "name email"
        )

        const workbook = new excelJS.Workbook()
        const worksheet = workbook.addWorksheet("Actions Report")

        worksheet.columns = [
            { header: "Action ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 20 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30}
        ]

        actions.forEach((action)=>{
            const assignedTo = action.assignedTo
                .map((user)=>`${user.name} (${user.email})`)
                .join(", ")
            worksheet.addRow({
                _id: action._id,
                title: action.title,
                description: action.description,
                priority: action.priority,
                status: action.status,
                dueDate: action.dueDate,
                assignedTo: assignedTo || "Unassigned"
            })
        })

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=actions_report.xlsx"
        )

        return workbook.xlsx.write(res).then(()=>{
            res.status(200).end()
        })
    } catch (error) {
        res.staus(500).json({ message: "Error Exporting actions", error: error.message })
    }
}

// @desc    export all users
// @route   GET /api/reports/export/users
// @access  private - admin
const exportUserReports = async(req, res)=>{
    try {
       const users = await User.find().select("name email _id").lean()
       const userActions = await Action.find().populate(
        "assignedTo",
        "name email"
       )

       const userActionsMap = {}
       users.forEach((user)=>{
        userActionsMap[user._id] = {
            name: user.name,
            email: user.email,
            actionCount: 0,
            pendingActions: 0,
            inProgressActions:0,
            completedActions:0,
        }
       })

       userActions.forEach((action)=>{
        if (action.assignedTo){
            action.assignedTo.forEach((assignedUser)=>{
                if(userActionsMap[assignedUser._id]){
                    userActionsMap[assignedUser._id].actionCount+=1
                    if(action.status === "Pending"){
                        userActionsMap[assignedUser._id].pendingActions+=1
                    }else if(action.status === "In Progress"){
                        userActionsMap[assignedUser._id].inProgressActions+=1
                    }else if(action.status === "Completed"){
                        userActionsMap[assignedUser._id].completedActions+=1
                    }
                }
            })
        }
       })

       const workbook = new excelJS.Workbook()
       const worksheet = workbook.addWorksheet("Users Actions Report")

       worksheet.columns = [
        { header: "Name", key: "name", width: 30 },
        { header: "Email", key: "email", width: 50},
        { header: "Action Count", key: "actionCount", width: 20},
        { header: "Pending Actions", key: "pendingActions", width: 20},
        { header: "In Progress Actions", key: "inProgressActions", width: 20},
        { header: "Completed Actions", key: "completedActions", width: 20}
       ]

       Object.values(userActionsMap).forEach((user)=>{
        worksheet.addRow(user)
       })

       res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
       )
       res.setHeader(
        "Content-Disposition",
        "attachment; filename=users_actions_report.xlsx"
       )

       return workbook.xlsx.write(res).then(()=>{
        res.status(200).end()
       })
    } catch (error) {
        res.status(500).json({ message: "Error Exporting users", error: error.message })
    }
}

module.exports = { exportActionReports, exportUserReports }
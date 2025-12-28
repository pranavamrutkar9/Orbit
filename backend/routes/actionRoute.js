const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getActions, getActionById, createAction, updateAction, deleteAction, updateActionStatus, updateActChecklist, getDashboardData, getUserDashboardData } = require("../controllers/actionController");


const router = express.Router()

router.get("/dashboard-data", protect, getDashboardData)
router.get("/user-dashboard-data", protect, getUserDashboardData)
router.get("/", protect, getActions) // get all actions (admin: all, members: assigned)
router.get("/:id", protect, getActionById) // get specific action
router.post("/", protect, adminOnly, createAction) // create action - admin only
router.put("/:id", protect, updateAction) // update actions
router.delete("/:id", protect, adminOnly, deleteAction) // delete action
router.put("/:id/status", protect, updateActionStatus)
router.put("/:id/acts", protect, updateActChecklist)

module.exports = router;
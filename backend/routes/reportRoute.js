const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportActionReports, exportUserReports } = require("../controllers/reportController");

const router = express.Router()

// excel/pdf
router.get("/export/actions", protect, adminOnly, exportActionReports)
router.get("/export/users", protect, adminOnly, exportUserReports)

module.exports = router;
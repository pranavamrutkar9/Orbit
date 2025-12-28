const mongoose = require("mongoose");

const actSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }
)

const actionSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
        dueDate: { type: Date, required: true },
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        attachments: [{ type: String }],
        actChecklist: [actSchema],
        progress: { type: Number, default: 0, min: 0, max: 100 }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Action", actionSchema)
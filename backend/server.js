require('dotenv').config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB= require('./config/db')

const app = express()

const authRoute = require("./routes/authRoute")
const userRoute = require("./routes/userRoute")
const actionRoute = require("./routes/actionRoute")
// const reportRoute = require("./routes/reportRoute")

// Middleware for cors
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/actions", actionRoute)
// app.use("/api/reports", reportRoute)

app.get("/", (req, res) => {
    res.send("Hello World")
})

// connect database
connectDB()

// start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
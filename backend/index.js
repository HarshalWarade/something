import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import http from "http"
import { Server } from "socket.io"
import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"

dotenv.config({ path: "config.env" })

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000

connectDB()

const MessageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
})


import { Message } from "./models/messages.model.js"

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" })
  }
})

io.on("connection", async (socket) => {
//   console.log("user connected:", socket.id)

  try {
    const messages = await Message.find()
    socket.emit("previousMessages", messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
  }

  socket.on("sendMessage", async (data) => {
    try {
      const message = new Message(data)
      await message.save()
      io.emit("receiveMessage", message) 
    } catch (error) {
      console.error("Error saving message:", error)
    }
  })

  socket.on("disconnect", () => {
    // console.log("user disconnected:", socket.id)
  })
})

app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)

server.listen(PORT, (err) => {
  if (err) console.log("Error at port init:", err)
  else console.log(`Server running at http://localhost:${PORT}`)
})

import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
})

export const Message = mongoose.model("Message", MessageSchema)
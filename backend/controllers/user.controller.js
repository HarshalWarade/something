import { User } from "../models/user.model.js"
import { Message } from "../models/messages.model.js"
import { Job } from "../models/job.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
import mongoose from "mongoose"

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      })
    }
    const file = req.file
    const fileUri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      access_mode: "public",
    })
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    })
    return res
      .status(201)
      .json({ message: "Account created successfully.", success: true })
  } catch (error) {
    console.log(error)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      })
    }
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      })
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      })
    }
    const tokenData = { userId: user._id }
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    })
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    }
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      })
  } catch (error) {
    console.log(error)
  }
}

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const profileView = async (req, res) => {
  try {
    const userId = req.params.id
    const currentUser = await User.findOne({ _id: userId })
    if (!currentUser) {
      return res.status(400).json({
        message: "User is not present",
        success: false,
      })
    }
    return res.status(200).json({
      message: "User fetched",
      currentUser,
      success: true,
    })
  } catch (error) {
    console.log("Error at profileView controller in user route: ", error)
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body
    const file = req.file
    let cloudResponse = null
    if (file) {
      const fileUri = getDataUri(file)
      cloudResponse = await cloudinary.uploader.upload(fileUri.content)
    }
    let skillsArray = skills ? skills.split(",") : []
    const userId = req.id
    let user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      })
    }
    if (fullname) user.fullname = fullname
    if (email) user.email = email
    if (phoneNumber) user.phoneNumber = phoneNumber
    if (bio) user.profile.bio = bio
    if (skills) user.profile.skills = skillsArray
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url
      user.profile.resumeOriginalName = file.originalname
    }
    await user.save()
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    }
    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    })
  } catch (error) {
    console.error("Something went wrong: ", error)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}

// export const getusers = async (req, res) => {
//     try {
//         const users = await User.find({ role: "student" }, "-password")

//         return res.status(200).json({
//             message: "Users fetched successfully",
//             users,
//             success: true
//         })
//     } catch (error) {
//         console.log("Error at getusers controller in user routes: ", error)
//         return res.status(500).json({
//             message: "Internal Server Error",
//             error: error.message,
//             success: false
//         })
//     }
// }

export const getusers = async (req, res) => {
  try {
    const currentUserId = req.id
    // console.log(req.id)
    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const users = await User.find(
      { role: "student", _id: { $ne: currentUserId } },
      "-password"
    )

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
      success: true,
    })
  } catch (error) {
    console.log("Error at getusers controller in user routes: ", error)
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    })
  }
}

// other things i wanted to do...

export const getMatchingJobs = async (req, res) => {
  try {
    const userId = req.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const userSkills = user.profile?.skills || []

    if (userSkills.length === 0) {
      return res.status(404).json({ message: "No skills found for this user" })
    }

    const matchingJobs = await Job.find({
      requirements: {
        $in: userSkills.map((skill) => new RegExp(`^${skill}$`, "i")),
      },
    }).populate("company", "name")


    if (matchingJobs.length === 0) {
      return res
        .status(200)
        .json({ message: "No matching jobs found", jobs: [], success: true })
    }

    res.status(200).json({ jobs: matchingJobs, success: true })
  } catch (error) {
    console.error("Error fetching matching jobs:", error)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}



export const deletemessages = async (req, res) => {
  try {
    const userId = req.id
    const user = await User.findById(userId)

    if(user.email !== "harshal1@gmail.com") {
      console.log("You have no access to this!")
      return
    }

    await Message.deleteMany({})
    res.json({ success: true, message: "All messages deleted successfully." })
  } catch (error) {
    console.error("Error deleting messages:", error)
    res.status(500).json({ success: false, message: "Failed to delete messages." })
  }
}



export const getMessages = async (req, res) => {
  try {
      const messages = await Message.find().sort({ createdAt: 1 }) 
      res.status(200).json({ success: true, messages })
  } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch messages" })
  }
}
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
    freelancingGigs: [
        {
            title: { type: String, required: true },
            description: { type: String },
            rate: { type: Number },
            available: { type: Boolean, default: true },
            tags: [{ type: String }],
            createdAt: { type: Date, default: Date.now }
        }
    ],
},{timestamps:true})
export const User = mongoose.model('User', userSchema)
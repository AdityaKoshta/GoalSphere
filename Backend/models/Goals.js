const  mongoose  = require("mongoose");

const goalSchema = mongoose.Schema({
    title: {
        type: String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    deadline: {
        type:Date,
        required:true,
    },
    isCompleted:{
        type:Boolean,
        default:false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    
}, {timestamps:true});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
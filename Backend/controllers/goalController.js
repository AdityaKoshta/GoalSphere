const Goal = require("../models/Goals");
const mongoose = require("mongoose");

exports.createGoal = async (req, res) => {
    const {title, description, deadline} = req.body;
    if(!title || !description || !deadline){
        return res.status(500).json({msg: "All the field are required"});
    }

    try{
        const newGoal = await Goal.create({title, description, deadline, user:req.user._id});
        console.log("Creating goal for user :", req.user);
        res.status(201).json(newGoal);

    }catch(err){
        console.log("Error in Create Goal :", err);
        res.status(500).json({msg: "Server Error"});
    }
};

exports.getGoals = async (req, res) => {
    try{
    const goals = await Goal.find({user:req.user._id}).sort({createdAt: -1});
    res.status(201).json(goals);
    }catch(err){
        console.log("Error in getGoals :",err);
        res.status(500).json({msg: "Server Error"});
    }
};


exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    // Authorization check
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updates = { ...req.body };

    // If user is marking the goal as completed, set completedAt
    if (req.body.isCompleted === true && !goal.completedAt) {
      updates.completedAt = new Date();
    }

    // Update the goal
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: updates }, // We’ll send { isCompleted: true } from frontend
      { new: true },
    );

    res.status(200).json(updatedGoal);
  } catch (err) {
    console.log("Error in updateGoal", err);
    res.status(500).json({ msg: "Server Error" });
  }
};


// exports.deleteGoal = async (req, res) => {
//     try{

//         const { id } = req.params;
//         const goal = await Goal.findById(id);

//         if(!goal){
//             res.status(404).json({msg: "Goal not found"});
//         }

//         if (!goal.user || goal.user.toString() !== req.user.id) {
//             return res.status(403).json({ msg: "Not authorized" });
//         }

//         await Goal.findByIdAndDelete(id);

//         res.status(500).json({msg : "Goal successfully deleted"});
//     }catch(err){
//         console.log("Error in deleteGoal", err);
//         res.status(500).json({msg: "Server Error"});
//     }

// };


exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: "Goal not found" });
    }

    //Add these logs to debug
    console.log("Goal.user:", goal.user); // ObjectId
    console.log("Req.user:", req.user);   // Check what it holds
    console.log("Goal.user.toString():", goal.user.toString());

    // ✅ Prevent crash if user field is missing
    if (!goal.user || goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Goal.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Goal successfully deleted" });
  } catch (err) {
    console.log("Error in deleteGoal", err);
    res.status(500).json({ msg: "Server Error" });
  }
};


exports.getWeeklyStats = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday

    const stats = await Goal.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          isCompleted: true,
          completedAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$completedAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sunday = 1, Saturday = 7
      }
    ]);

    // Convert day numbers to readable labels (optional)
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedStats = Array.from({ length: 7 }, (_, i) => {
      const stat = stats.find((s) => s._id === i + 1);
      return {
        day: dayMap[i],
        count: stat ? stat.count : 0,
      };
    });

    res.json(formattedStats);

  } catch (err) {
    console.log("Error in getWeeklyStats:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

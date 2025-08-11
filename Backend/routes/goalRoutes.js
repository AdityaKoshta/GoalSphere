const express = require('express');
const router = express.Router();

const {getGoals, createGoal, updateGoal, deleteGoal, getWeeklyStats} = require("../controllers/goalController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getGoals);
router.post("/", authMiddleware, createGoal);
router.put("/:id", authMiddleware, updateGoal);
router.delete("/:id", authMiddleware, deleteGoal);
router.get("/weekly-data", authMiddleware, getWeeklyStats);


module.exports = router;
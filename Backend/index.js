require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
// Security rule for api in browser, used because frontend and Backend runs on different ports.
const checkDeadlines = require("./cron/checkDeadlines");

const app = express();


mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDb Connected");
  checkDeadlines();
}).catch((err) => {
  console.log(err);
});


//Middlewares
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/goals", require("./routes/goalRoutes"));

//Routes
app.get("/", (req, res) => {
  res.send("This is the Root file of Backend");
});


//Post route for users


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
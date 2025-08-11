const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    port: 465,
    secure: true
})

const sendDeadlineMail = async (to, goalTitle) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to, 
        subject: "Deadline Missing - GoalSphere",
        text: `You have reached your task deadline but not yet completed your task: ${goalTitle}. Please take action.`,
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`Email send to ${to}`);
    } catch(err){
        console.log("Error in Sending Email",err);
    }
};

module.exports = sendDeadlineMail;
import nodemailer from "nodemailer";
import AppError from "../utils/appError.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "taihk2@gmail.com",
    pass: "jiym btcy kioa ztyy",
  },
});

const mailOptions = (receipter, subject, text) => {
  console.log("Receip", receipter);
  return { from: "Online Course", to: receipter, subject: subject, text: text };
};

const sendEmail = async (mailOptions) => {
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    return new AppError(`Không thể gửi email: ${error}`, 500);
  }
};

export { mailOptions, sendEmail };

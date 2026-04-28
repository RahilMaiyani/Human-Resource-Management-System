import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error) => {
  if (error) {
    console.error("Mail transporter error:", error.message);
  } else {
    console.log("Mail server is ready");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"OfficeLink" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Email error:", err.message);
    throw err; 
  }
};
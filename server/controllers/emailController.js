import { sendEmail } from "../utils/sendEmail.js";
import { buildEmailTemplate } from "../utils/emailTemplate.js";

export const sendCustomEmail = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const { to, subject, message } = req.body;

    const html = buildEmailTemplate({
      title: subject,
      color: "#4f46e5",
      message: `
        <p style="margin:0 0 16px 0;">
          Hello,
        </p>

        <p style="margin:0 0 16px 0;">
          ${message}
        </p>

        <p style="margin-top:20px;">
          Regards,<br/>
          HR Team
        </p>
      `
    });

    await sendEmail({
      to,
      subject,
      html
    });

    res.json({ msg: "Email sent" });
  } catch (err) {
    res.status(500).json({ msg: "Email failed" });
  }
};
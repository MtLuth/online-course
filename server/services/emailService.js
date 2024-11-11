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

const mailOptions = (receipter, subject, html) => {
  console.log("Receip", receipter);
  return { from: "Online Course", to: receipter, subject: subject, html: html };
};

const sendEmail = async (mailOptions) => {
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    return new AppError(`Không thể gửi email: ${error}`, 500);
  }
};

const getEmailTemplateActive = (emailLink) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Chào mừng bạn đến với trang web của chúng tôi!!</h2>
      <p>Để hoàn tất quá trình đăng ký, vui lòng nhấn vào nút dưới đây để kích hoạt tài khoản của bạn:</p>
      <a 
        href="${emailLink}" 
        style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;"
      >
        Kích hoạt tài khoản
      </a>
      <p>Nếu bạn không yêu cầu kích hoạt tài khoản, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ Online Course</p>
    </div>
  `;
};

const getEmailTemplateResetPassword = (resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Yêu cầu đặt lại mật khẩu</h2>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng nhấn vào nút dưới đây để đặt lại mật khẩu:</p>
      <a 
        href="${resetLink}" 
        style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;"
      >
        Đặt lại mật khẩu
      </a>
      <p><strong>Lưu ý:</strong> Liên kết đặt lại mật khẩu này sẽ hết hạn sau 5 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
      <p>Trân trọng,<br/>Đội ngũ Online Course</p>
    </div>
  `;
};

export {
  mailOptions,
  sendEmail,
  getEmailTemplateActive,
  getEmailTemplateResetPassword,
};

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

const mailOptions = (receiptor, subject, html) => {
  return { from: "Online Course", to: receiptor, subject: subject, html: html };
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

const getTemplateAdminCheckInstructor = (state) => {
  if (state.status === "approve") {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Yêu cầu đăng ký của bạn đã được chấp thuận!</h2>
          <p>Chúng tôi vui mừng thông báo rằng yêu cầu đăng ký của bạn đã được phê duyệt.</p>
          <p>Để hoàn tất việc kích hoạt tài khoản, vui lòng nhấn vào nút dưới đây:</p>
          <a 
            href="${state.emailLink}" 
            style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;"
          >
            Kích hoạt tài khoản
          </a>
          <p>Chúc bạn một ngày tốt lành!</p>
          <p>Trân trọng,<br/>Đội ngũ Online Course</p>
        </div>
      `;
  } else {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #FF6347;">Rất tiếc, yêu cầu đăng ký của bạn không được chấp thuận</h2>
          <p>Chúng tôi rất tiếc phải thông báo rằng yêu cầu đăng ký của bạn không được phê duyệt.</p>
          <p><strong>Lý do:</strong> ${state.reason}</p>
          <p>Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.</p>
          <p>Trân trọng,<br/>Đội ngũ Online Course</p>
        </div>
      `;
  }
};

const getTemplateAcceptRefund = (orderCode, courses, amount) => {
  const courseList =
    courses.length > 0
      ? courses
          .map(
            (course) =>
              `<li><strong>Khóa học:</strong> ${course.title} (${Number(
                course.price
              ).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })})</li>`
          )
          .join("")
      : "<li>Không có khóa học nào trong đơn hàng.</li>";
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Yêu cầu hoàn tiền đã được chấp nhận!</h2>
    <p>Chào bạn,</p>
    <p>Chúng tôi rất vui thông báo rằng yêu cầu hoàn tiền của bạn cho đơn hàng <strong>${orderCode}</strong> đã được xử lý thành công.</p>
    <h3>Thông tin chi tiết:</h3>
    <ul>
      ${courseList}
    </ul>
    <p><strong>Số tiền hoàn lại:</strong> ${Number(amount).toLocaleString(
      "vi-VN",
      {
        style: "currency",
        currency: "VND",
      }
    )}</p>
    <p>Số tiền này sẽ được hoàn lại thông qua phương thức thanh toán bạn đã sử dụng. Thời gian nhận tiền dự kiến là 3-5 ngày làm việc.</p>
    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số hotline.</p>
    <p>Trân trọng,<br/>Đội ngũ Online Course</p>
  </div>`;
};

const getTemplateRejectRefund = (orderCode, courses, reason) => {
  const courseList =
    courses.length > 0
      ? courses
          .map(
            (course) =>
              `<li><strong>Khóa học:</strong> ${course.title} (${Number(
                course.price
              ).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })})</li>`
          )
          .join("")
      : "<li>Không có khóa học nào trong đơn hàng.</li>";
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #FF6347;">Yêu cầu hoàn tiền đã bị từ chối</h2>
    <p>Chào bạn,</p>
    <p>Chúng tôi rất tiếc thông báo rằng yêu cầu hoàn tiền của bạn cho đơn hàng <strong>${orderCode}</strong> đã bị từ chối.</p>
    <h3>Thông tin chi tiết:</h3>
    <ul>
      ${courseList}
    </ul>
    <p><strong>Lý do từ chối:</strong> ${reason}</p>
    <p>Nếu bạn có bất kỳ thắc mắc nào hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi qua email hoặc số hotline.</p>
    <p>Trân trọng,<br/>Đội ngũ Online Course</p>
  </div>`;
};

export {
  mailOptions,
  sendEmail,
  getEmailTemplateActive,
  getEmailTemplateResetPassword,
  getTemplateAdminCheckInstructor,
  getTemplateAcceptRefund,
  getTemplateRejectRefund,
};

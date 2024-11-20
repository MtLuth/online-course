import instructorRepo from "../repository/instructorRepo.js";
import walletRepo from "../repository/walletRepo.js";
import withdrawRequestRepo from "../repository/withdrawRequestRepo.js";
import AppError from "../utils/appError.js";
import {
  getTemplateCancelWithdraw,
  mailOptions,
  sendEmail,
} from "./emailService.js";

class WithdrawRequestService {
  async createWithdrawRequest(uid, amount, bankName, bankNumber) {
    try {
      const wallet = await walletRepo.getWalletByUid(uid);
      if (amount > wallet.withdrawable) {
        console.log(wallet.withdrawable);
        throw new AppError(`Số tiền rút phải nhỏ hơn số dư có thể rút!`, 400);
      }
      await walletRepo.updateWallet(uid, {
        withdrawable: -amount,
        withdrawPending: +amount,
      });
      await withdrawRequestRepo.addNewRequest(
        uid,
        amount,
        bankName,
        bankNumber
      );
      return "Yêu cầu của bạn sẽ được giải quyết từ 3-5 ngày!";
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async adminGetAllWithdrawRequest(status, searchParam) {
    try {
      let withdraws = await withdrawRequestRepo.adminGetWithdrawRequest(status);
      withdraws = await Promise.all(
        withdraws.map(async (item) => {
          const uid = item.uid;
          const instructor = await instructorRepo.getInstructorByUid(uid);
          return {
            ...item,
            fullName: instructor?.fullName || "Unknown",
            email: instructor?.email || "Unknown",
          };
        })
      );
      if (searchParam?.trim()) {
        const searchLower = searchParam.toLowerCase();
        withdraws = withdraws.filter(
          (item) =>
            item.email.toLowerCase().includes(searchLower) ||
            item.fullName.toLowerCase().includes(searchLower)
        );
      }
      return withdraws;
    } catch (error) {
      throw new AppError(
        `Lỗi khi lấy danh sách yêu cầu rút tiền: ${error}`,
        500
      );
    }
  }

  async adminUpdateStatus(id, status, reason) {
    try {
      await withdrawRequestRepo.updateStatus(id, status);

      const withdraw = await withdrawRequestRepo.getWithdrawById(id);
      const amount = withdraw.amount;
      const uid = withdraw.uid;
      if (status === "Cancel") {
        await walletRepo.updateWallet(uid, {
          withdrawable: amount,
          withdrawPending: -amount,
        });

        const instructor = await instructorRepo.getInstructorByUid(uid);
        const templateEmail = getTemplateCancelWithdraw(
          id,
          withdraw.amount,
          reason
        );
        const mailDialUp = mailOptions(
          instructor.email,
          "Yêu cầu rút tiền Elearning",
          templateEmail
        );
        await sendEmail(mailDialUp);
      }
      if (status === "Complete") {
        await walletRepo.updateWallet(uid, {
          withdrawPending: -amount,
          withdrawnAmount: amount,
        });
      }
      return "Cập nhật yêu cầu rút tiền thành công!";
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new WithdrawRequestService();

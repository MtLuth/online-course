import walletRepo from "../repository/walletRepo.js";
import withdrawRequestRepo from "../repository/withdrawRequestRepo.js";
import AppError from "../utils/appError.js";

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
}

export default new WithdrawRequestService();

import walletRepo from "../repository/walletRepo.js";
import AppError from "../utils/appError.js";

class WalletService {
  async updateWallet(uid, newWallet) {
    try {
      await walletRepo.updateWallet(uid, newWallet);
      return "Cập nhật tài khoản thành công";
    } catch (error) {
      throw new AppError(
        `Lỗi trong quá trình cập nhật tài khoản ${error}`,
        500
      );
    }
  }
}

export default new WalletService();

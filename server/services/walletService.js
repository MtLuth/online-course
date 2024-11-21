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

  async getWalletByUid(uid) {
    try {
      const result = await walletRepo.getWalletByUid(uid);
      return result;
    } catch (error) {
      throw new AppError(
        `Lỗi trong khi lấy thông tin ví điện tử: ${error}`,
        500
      );
    }
  }
}

export default new WalletService();

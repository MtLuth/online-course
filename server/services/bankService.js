import BankRepo from "../repository/bankRepo.js";
import AppError from "../utils/appError.js";

class BankService {
  async getAllBank(searchParam) {
    try {
      let banks = await BankRepo.getAllBank();
      if (searchParam !== undefined && searchParam !== "") {
        banks = banks.filter((bank) => bank.bankName.includes(searchParam));
      }
      return banks;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new BankService();

import walletService from "../services/walletService.js";
import catchAsync from "../utils/catchAsync.js";

class WalletController {
  updateWallet = catchAsync(async (req, res, next) => {
    const uid = req.body.uid;
    const newWallet = req.body.wallet;
    await walletService.updateWallet(uid, newWallet);
    res.status(200).json({
      status: "Successfully",
      message: "Thành công",
    });
  });
}

export default new WalletController();

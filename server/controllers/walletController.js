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

  getWallet = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const result = await walletService.getWalletByUid(uid);
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });
}

export default new WalletController();

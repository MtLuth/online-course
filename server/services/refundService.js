import Refund, { RefundStatus } from "../model/refundModel.js";
import purchaseHistoryRepo from "../repository/purchaseHistoryRepo.js";
import refundRepo from "../repository/refundRepo.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";

class RefundService {
  async createRefund(uid, refundInformation) {
    try {
      const orderCode = refundInformation.orderCode;
      const purchaseHistory =
        await purchaseHistoryRepo.getPurchaseByCode(orderCode);
      if (purchaseHistory === null) {
        throw new AppError("Không tìm thấy đơn hàng nào", 400);
      }
      if (purchaseHistory.uid !== uid) {
        throw new AppError(
          "Bạn không có quyền tạo yêu cầu hoàn tiền cho hóa đơn này!",
          400
        );
      }
      const courseId = refundInformation.courseId
      const sku = purchaseHistory.sku
      let courses = []
      sku.forEach((course) => { 
        
       });
      const boughtAt = purchaseHistory.boughtAt._seconds;
      const currentDate = Date.now();
      if (currentDate - boughtAt > 1000 * 60 * 60 * 24) {
        throw new AppError(`Đơn hàng của bạn đã quá hạn hoàn tiền!`);
      }
      const refundId = crypto.randomBytes(6).toString("hex");
      const refund = new Refund(
        refundId,
        orderCode,
        refundInformation.courseId,
        refundInformation.amount,
        RefundStatus.InProgress,
        refundInformation.reason,
        refundInformation.payeeAccount
      );
      await refundRepo.createRefund(uid, refund);
      return "Yêu cầu hoàn tiền của bạn đã được gửi đi!";
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

return new RefundService();

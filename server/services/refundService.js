import ErrorMessage from "../messages/errorMessage.js";
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

      const sku = purchaseHistory.sku;

      let courses = refundInformation.courses;
      const refundCourses = sku.reduce((newCourses, item) => {
        if (courses.includes(item.courseId)) {
          if (item.refundStatus) {
            throw new AppError(
              `Bạn đã gửi yêu cầu hoàn tiền cho khóa học ${item.title} rồi!`,
              400
            );
          }
          newCourses.push({
            courseId: item.courseId,
            price: item.salePrice,
            title: item.title,
          });
        }
        return newCourses;
      }, []);
      const amount = refundCourses.reduce((sum, item) => sum + item.price, 0);
      const boughtAt = purchaseHistory.boughtAt._seconds * 1000;
      const currentDate = Date.now();
      if (currentDate - boughtAt > 1000 * 60 * 60 * 24) {
        throw new AppError(`Đơn hàng của bạn đã quá hạn hoàn tiền!`);
      }
      const refund = new Refund(
        orderCode,
        refundCourses,
        amount,
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

  async getAllRefundsByAdmin(filterStatus) {
    try {
      let results = await refundRepo.getAllRefund(filterStatus);
      return results;
    } catch (error) {
      throw new AppError(
        `Lỗi khi lấy danh sách yêu cầu hoàn tiền ${error}`,
        500
      );
    }
  }

  async viewDetailRefund(id) {
    try {
      const results = await refundRepo.viewDetailRefund(id);
      return results;
    } catch (error) {
      throw new AppError(ErrorMessage.Internal, 500);
    }
  }
}

export default new RefundService();

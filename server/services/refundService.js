import ErrorMessage from "../messages/errorMessage.js";
import Refund, { RefundStatus } from "../model/refundModel.js";
import purchaseHistoryRepo, {
  PurchaseStatus,
} from "../repository/purchaseHistoryRepo.js";
import refundRepo from "../repository/refundRepo.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import {
  getTemplateAcceptRefund,
  getTemplateRejectRefund,
  mailOptions,
  sendEmail,
} from "./emailService.js";
import incomeRepo from "../repository/incomeRepo.js";
import myLearningsRepo from "../repository/myLearningsRepo.js";
import walletRepo from "../repository/walletRepo.js";
import { REFUSED } from "dns";

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
              `Bạn đã gửi yêu cầu hoàn tiền cho hóa đơn này rồi!`,
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

      await Promise.all([
        incomeRepo.updateRefundStatus(orderCode, true),
        myLearningsRepo.removeCourses(uid, refundCourses),
      ]);
      await refundRepo.createRefund(uid, refund);
      return "Yêu cầu hoàn tiền của bạn đã được gửi đi!";
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async getAllRefundsByAdmin(filterStatus, searchParam) {
    try {
      let results = await refundRepo.getAllRefund(filterStatus);
      if (searchParam) {
        results = results.filter((item) => item.email.includes(searchParam));
      }
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

  async updateStatusRefund(id, status, reason) {
    try {
      const refund = await refundRepo.viewDetailRefund(id);
      let templateEmail = null;
      if (status === "Accepted") {
        const income = await incomeRepo.getIncomeByOrderCode(refund.orderCode);
        if (income === null) {
          throw new AppError(`Lỗi không tìm thấy thông tin thu nhập!`, 500);
        }
        await walletRepo.updateWallet(income.uid, {
          inProgress: -income.amount,
        });

        templateEmail = getTemplateAcceptRefund(
          refund.orderCode,
          refund.courses,
          refund.amount
        );
      }
      if (status === "Reject") {
        const income = await incomeRepo.getIncomeByOrderCode(refund.orderCode);
        if (income === null) {
          throw new AppError(`Lỗi không tìm thấy thông tin thu nhập!`, 500);
        }

        await incomeRepo.updateRefundStatus(income.id, false);
        if (Date.now() - income.date._seconds * 1000 > 1000 * 3600 * 24) {
          await walletRepo.updateWallet(income.uid, {
            inProgress: -income.amount,
            withdrawable: income.amount,
          });
        }

        const order = await purchaseHistoryRepo.getPurchaseByCode(refund.order);
        const sku = order.sku;
        await Promise.all(
          sku.forEach(async (course) => {
            myLearningsRepo.addCourses(order.uid, course).catch((err) => {
              throw new AppError(
                `Lỗi khi thêm khóa học vào myLearnings người dùng`,
                500
              );
            });
          })
        );

        templateEmail = getTemplateRejectRefund(
          refund.orderCode,
          refund.courses,
          reason
        );
      }
      if (templateEmail !== null) {
        const mailDialUp = mailOptions(
          refund.email,
          "Yêu cầu hoàn tiền",
          templateEmail
        );
        await sendEmail(mailDialUp);
      }
      const message = await refundRepo.updateStatusRefund(id, status);
      return message;
    } catch (error) {
      throw new AppError(
        `Lỗi khi cập nhật trạng thái yêu cầu hoàn tiền: ${error}`,
        500
      );
    }
  }

  async getAllRefundOfStudent(uid, status, searchParam) {
    try {
      let results = await refundRepo.getAllRefundOfStudent(uid, status);
      if (searchParam) {
        results = results.filter((item) =>
          item.orderCode.includes(searchParam)
        );
      }
      results = results.sort((a, b) => b.date - a.date);
      return results;
    } catch (error) {
      throw new AppError(`Lỗi khi lấy danh sách yêu cầu hoàn tiền!`, 500);
    }
  }

  async studentCancelRefund(id) {
    try {
      const refund = await refundRepo.viewDetailRefund(id);
      if (refund === null) {
        throw new AppError(`Lỗi khi lấy thông tin hoàn tiền!`, 500);
      }
      const purchase = await purchaseHistoryRepo.getPurchaseByCode(
        refund.orderCode
      );
      if (Date.now() - purchase.boughtAt._seconds * 1000 > 1000 * 60 * 3) {
        await Promise.all([
          purchaseHistoryRepo.updateStatusPurchase(
            refund.orderCode,
            purchase.sku,
            false
          ),
          purchase.sku.forEach((item) => {
            walletRepo.updateWallet(item.instructor, {
              inProgress: -item.salePrice * 0.94,
              withdrawable: item.salePrice * 0.94,
            });
          }),
        ]);
      } else {
        await purchaseHistoryRepo.updateRefundStatus(
          refund.orderCode,
          purchase.sku,
          false
        );
      }
      await Promise.all([
        myLearningsRepo.addCourses(purchase.uid, purchase.sku),
        await refundRepo.updateStatusRefund(id, "Cancel"),
      ]);
      return "Bạn đã hủy hoàn tiền cho đơn hàng này!";
    } catch (error) {
      console.log(error);
      throw new AppError(error, 500);
    }
  }
}

export default new RefundService();

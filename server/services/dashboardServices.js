import { InstructorStatus } from "../model/instructorModel.js";
import { RefundStatus } from "../model/refundModel.js";
import courseRepo from "../repository/courseRepo.js";
import instructorRepo from "../repository/instructorRepo.js";
import purchaseHistoryRepo from "../repository/purchaseHistoryRepo.js";
import refundRepo from "../repository/refundRepo.js";
import userRepo from "../repository/userRepo.js";
import withdrawRequestRepo, {
  WithdrawStatus,
} from "../repository/withdrawRequestRepo.js";
import AppError from "../utils/appError.js";

class DashboardService {
  async dashBoardAdmin() {
    try {
      const [
        role,
        income,
        publishedCourses,
        instructorPending,
        refundInProgress,
        withdrawPending,
      ] = await Promise.all([
        userRepo.getNumberOfRole(),
        purchaseHistoryRepo.getIncomeAdmin(),
        courseRepo.numberOfPublishedCourses(),
        instructorRepo.getNumberOfInstructorsByStatus(InstructorStatus.Pending),
        refundRepo.countRefundByStatus(RefundStatus.InProgress),
        withdrawRequestRepo.countNumberWithdrawByStatus(WithdrawStatus.Pending),
      ]);
      return {
        ...role,
        ...income,
        ...publishedCourses,
        numberInstructorPending: instructorPending,
        numberRefundInProgress: refundInProgress,
        numberWithdrawPending: withdrawPending,
      };
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async dashboardInstructor(uid) {
    try {
      console.log(uid);
      const [numberOfCourses, income] = await Promise.all([
        courseRepo.numberCoursesOfInstructor(uid),
        purchaseHistoryRepo.getPurchaseOfInstructor(uid),
      ]);
      return { ...numberOfCourses, ...income };
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}
export default new DashboardService();

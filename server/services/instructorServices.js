import Instructor from "../model/instructorModel.js";
import instructorRepo from "../repository/instructorRepo.js";
import AppError from "../utils/appError.js";
class InstructorService {
  async getAllInstructor(status, searchParam) {
    try {
      let instructors = [];
      const snapshot = await instructorRepo.getAllInstructor(status);
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (searchParam) {
          searchParam = searchParam.toLowerCase();
        }

        const matchesFullName =
          data.fullName && data.fullName.toLowerCase().includes(searchParam);
        const matchesEmail =
          data.email && data.email.toLowerCase().includes(searchParam);

        if (matchesFullName || matchesEmail || !searchParam) {
          instructors.push({ id: doc.id, ...data });
        }
      });

      return instructors;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async studentViewInstructor(uid) {
    try {
      const instructor = await instructorRepo.getInstructorByUid(uid);
      return instructor;
    } catch (error) {
      throw new AppError(`Lỗi khi tìm kiếm thông tin chuyên gia ${error}`, 500);
    }
  }
}

export default new InstructorService();

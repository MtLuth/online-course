import myLearningsRepo from "../repository/myLearningsRepo.js";
import AppError from "../utils/appError.js";

class MyLearningService {
  async getAllCourses(uid, searchParam) {
    try {
      const results = await myLearningsRepo.getAllCourses(uid);
      if (results === null) {
        return {
          courses: [],
        };
      }
      if (searchParam && searchParam !== "") {
        const filterResults = results.filter((course) => {
          const titleMatch =
            course.title && course.title.toLowerCase().includes(searchParam);
          return titleMatch;
        });
        return filterResults;
      }
      return results;
    } catch (error) {
      throw new AppError();
    }
  }
}

export default new MyLearningService();

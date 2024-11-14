import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

const authAdmin = firebaseAdmin.auth();
const dbRef = firebaseAdmin.firestore().collection("instructors");

class InstructorService {
  async getAllInstructor(status, searchParam) {
    try {
      let query = dbRef;
      if (status != null) {
        query = query.where("status", "==", status);
      }

      const instructors = [];
      const snapshot = await query.get();
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
}

export default new InstructorService();

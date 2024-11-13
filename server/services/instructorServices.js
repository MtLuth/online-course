import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

const authAdmin = firebaseAdmin.auth();
const dbRef = firebaseAdmin.firestore().collection("instructors");

class InstructorService {
  async getAllInstructor(status, searchParam, limit, page) {
    try {
      let query = dbRef;
      if (status != null) {
        query = query.where("status", "==", status);
      }

      query = query.orderBy("fullName");

      let lastDoc = null;
      const skipDoc = (page - 1) * limit;
      if (skipDoc > 0) {
        const snapshot = await query.limit(skipDoc).get();
        if (snapshot.empty) {
          return { instructors: [], lastDoc: null };
        }
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }

      const instructors = [];
      const snapshot = await query.limit(limit).get();
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

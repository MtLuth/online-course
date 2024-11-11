import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

const authAdmin = firebaseAdmin.auth();
const dbRef = firebaseAdmin.firestore().collection("instructors");

class InstructorService {
  async getAllInstructor(status, searchParams) {
    try {
      let query = dbRef;
      if (status != null) {
        query = query.where("status", "==", status);
      }

      const instructors = [];
      const snapshot = await query.get();
      snapshot.forEach((doc) => {
        const data = doc.data();

        const matchesFullName = searchParams?.fullName
          ? data.fullName && data.fullName.includes(searchParams.fullName)
          : true;
        const matchesEmail = searchParams?.email
          ? data.email && data.email.includes(searchParams.email)
          : true;

        if (matchesFullName && matchesEmail) {
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

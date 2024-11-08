import catchAsync from "../utils/catchAsync.js";
import firebaseAdmin from "../firebase/firebaseAdmin.js";
import {} from "firebase/auth";

const validateUser = catchAsync(async (req, res, next) => {
  const token = req.cookies.access_cookie;
  if (token) {
    console.log(token);
    const test = await firebaseAdmin.auth().verifySessionCookie(req.cookies);
    res.status(200).json({ test });
  }
  res.status(200).json({ aaaa: "hahaha" });
});

export { validateUser };

// import dotenv from "dotenv";
// dotenv.config({
//   path: "./config.env",
// });
import app from "./app/app.js";

const port = process.env.PORT || 1999;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

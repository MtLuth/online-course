import app from "./app/app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./config.env",
});

const port = process.env.PORT || 1999;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

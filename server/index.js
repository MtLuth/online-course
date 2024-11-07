import dotenv from "dotenv";
import app from "./app/app.js";

dotenv.config({
  path: "./config.env",
});

const port = process.env.PORT || 1999;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const dotenv = require("dotenv");

const app = require("./app/app");

dotenv.config({ path: `${__dirname}/.env` });

const port = process.env.PORT || 1999;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/users")

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

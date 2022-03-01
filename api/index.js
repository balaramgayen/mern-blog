const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const user = require("./routes/auth");
const post = require("./routes/post");

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//mongodb atlas connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB connected successfully"))
  .catch((err) => console.log("some error occurred", err));

app.get("/", (req, res) => {
  res.status(200).send("this is blog backend");
});

app.use("/api/auth", user);
app.use("/api/posts", post);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`backend is running on port ${port}`);
});

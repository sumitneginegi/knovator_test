const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);

const bodyparser = require("body-parser");

app.use(
  cors({
    origin: "*",
  })
);

const user = require("./route/user");

require("dotenv").config();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 7000;

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Set up your routes before applying CORS middleware
app.get("/home", (req, res) => {
  res.status(200).send({ msg: "Working App" });
});

app.use("/api/v1/user", user);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

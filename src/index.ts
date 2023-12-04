import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

import router from "./router";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "development" ? "http://localhost:5173" : "",
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

const MONGO_URL =
  "mongodb+srv://wealthwave-anthony:nL0uFkdSoVCq06z1@cluster0.ekxlxcm.mongodb.net/?retryWrites=true&w=majority"; // DB URI

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());

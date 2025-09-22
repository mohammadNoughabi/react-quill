import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Mongodb connected successfully.");
    })
    .catch((error) => {
      console.log("Mongodb connection failed");
    });
};

export default connectDb;

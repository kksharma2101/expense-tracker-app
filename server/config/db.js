import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    if (connect) {
      console.log("DB connected...");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectToDb;

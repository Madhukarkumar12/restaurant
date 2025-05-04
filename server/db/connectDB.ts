// 3oMRVV3ScX7XNdTb
import mongoose from "mongoose";
const connectDB = async ()=>{
   try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("MongoDB connected successfully");

   } catch(error) {
      console.log("Error connecting to MongoDB:", error);
   }
}

export default connectDB;

// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI as string);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1); // Exit process with failure
//   }
// };

// export default connectDB;

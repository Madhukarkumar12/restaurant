import express from "express";
import Cors from "cors";
import connectDB from "./db/connectDB.ts";

import userRoute from "./routes/user.route.ts";
// import restaurantRoute from "./routes/restaurant.route.ts";
// import menuRoute from "./routes/menu.route.ts";
// import orderRoute from "./routes/order.route.ts";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";


dotenv.config();
const app = express();

const PORT = 3000;
app.use(bodyParser.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true, limit:'10mb'}))
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin:"http://localhost:5173",
    credentials:true
}

app.use(Cors(corsOptions));

// api
app.use("/api/v1/user", userRoute);
// app.use("/api/v1/restaurant", restaurantRoute);
// app.use("/api/v1/menu", menuRoute);
// app.use("/api/v1/order", orderRoute);

// app.get("/",(req,res)=>{
//     res.send("API is running successfully..")
// })
// app.post("/test", (req, res) => {
//     console.log("Received data:", req.body);
//     res.json({ message: "POST request successful", data: req.body });
//   });

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port: ${PORT}`)
})
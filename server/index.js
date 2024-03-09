import express from "express"
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";

const corsOptions = {
    origin: "https://blog-app-ten-sage.vercel.app",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
// http://localhost:5173
mongoose.connect(process.env.MONGO)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));


const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
    res.send({ msg: "Welcome to the blog API!" })
});
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

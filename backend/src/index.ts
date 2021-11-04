import express from "express";
import mongoose from "mongoose";
import connectDB from "./connectDB";
import cors, { CorsOptions } from "cors";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser())
app.use(express.json())
const corsOptions :CorsOptions = {
    origin : "http://localhost:3000",
    methods : "GET,PUT,POST,DELETE",
    credentials  : true,
    optionsSuccessStatus : 200
}
app.use(cors(corsOptions))


const PORT = process.env.PORT || 5000;
export interface IRequestUserInterface extends Request {
    user : any
}
app.use("/user", userRoutes)

app.use(errorHandler)

connectDB()
    .then(() =>{
        app.listen(PORT, () => {
            console.log("Server running on port "+PORT);
        })

})
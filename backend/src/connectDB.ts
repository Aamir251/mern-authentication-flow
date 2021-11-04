import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config()
const MONGO_URL : string = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.h0dn7.mongodb.net/JWT?retryWrites=true&w=majority`

export default async () => {
    mongoose.connect(MONGO_URL).then(() => {
        console.log("Database Connected");
    })
}
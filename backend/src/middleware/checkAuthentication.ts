import { NextFunction, RequestHandler, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUserData } from "../models/user";


// middleware to check if user is logged in or not
export const checkAuthentication  = async (req : Request, res : Response, next : NextFunction) => {
    
    
    try {
        const authorization = req.headers["authorization"];
        if (!authorization) throw new Error("Not Header found")    
        // since token is sent from browser as header
        
        // splitting the token since token sent in the format - 
        //  Bearer asdjkbjgkdkbasjdkgb
        // we just need the latter part i.e. askdjasdgsdb...
        let token = (authorization as string).split(" ")[1];
        console.log("Refresh Token is ",token);
        
           
        const decoded = jwt.verify(token, "SECRET_ACCESS_KEY") as JwtPayload
        if (decoded) {
            req.user = await User.findById(decoded.id).select("-password") as IUserData
            next()
            
        } else {
            // session expired
            throw new Error("Not Authenticated")
            
        }
        
    } catch (error : any) {
        res.status(401).json({ message : error.message})
        
    }
    
}
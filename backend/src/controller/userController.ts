import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/UserInterface";
import User, { IUserData } from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";

let allRefreshTokens:string[] = [];

export const registerUser  = async (req:Request, res:Response, next : NextFunction) => {
    
    const { username, email, password } : IUser = req?.body;

    if (username && email && password ) {
        
        try {
            const userExists = await User.findOne({ email })

            if (userExists) {
                res.status(400);
                throw new Error("User Already Exists")
            }
            // creating (saving) this user to database   
            const newUser : IUserData =  await User.create({username, email, password });
            
            // if new user was created successfully
            if (newUser) {
                res.status(201).json({
                    id : newUser._id,
                    username : newUser.username,
                    email : newUser.email,
                    password : newUser.password

                })
            }
            
        } catch (error) {
            
            next(error);
        }
    }
    
}

export const loginUser = async (req: Request, res : Response, next : NextFunction) => {
    const { email, password } : IUser = req?.body;
    
    try {
        // Checking if a user exists with the given email
        const foundUser = await User.findOne({email});
        if (!foundUser) throw new Error("Could not find User")
        
        if (!await foundUser.validatePassword(password)) {
            // If password does not match
            throw new Error("Incorrect Password")
        }
        
        // LOGIN SUCCESSFUL

        // creating access and refresh token for the given user ID
        let accessToken = foundUser && jwt.sign({id : foundUser._id}, "SECRET_ACCESS_KEY", { expiresIn : '45s'});
        let refreshToken = foundUser && jwt.sign({ id : foundUser._id }, "SECRET_REFRESH_KEY", { expiresIn : '7d' });

        refreshToken && allRefreshTokens.push(refreshToken);

        // it is better to use a strange cookie name
        res.cookie("refreshToken", refreshToken, {
            httpOnly :true, //so refresh token isn't accessible through Javascript
            // path
        })

        return res.status(201).json({
            id : foundUser._id,
            username : foundUser.username,
            email : foundUser.email,
            accessToken,
        })

    } catch (error) {
        
        next(error)
        
    }
}

// get all users from database
export const protectedPage = async (req: Request, res: Response) => {

    res.status(201).json({ message : "Hurray, You hit protected Route. You are logged In" })
}

// Renewing Access Token

export const renewAccessToken = async (req : Request, res : Response) => {

    // although cookies is sent as headers
    // cookieParse automatically parses it into JSON format and assigns it to a cookie variable in req
    let refreshToken = req.cookies?.refreshToken;
    console.log("The Refresh Token is ",refreshToken);
    
    if (!refreshToken || !allRefreshTokens.includes(refreshToken)) {
        return res.send({message : "fail", accessToken  : ""})
    }
    let decoded;

    try {

        decoded = jwt.verify(refreshToken, "SECRET_REFRESH_KEY") as JwtPayload
        
    } catch (error) {
        return res.send({message : "fail", accessToken  : ""})

    }

    const user : IUserData = await User.findById(decoded.id) as IUserData;

    if (!user) {
        return res.send({ message : "fail", accessToken : ""})
    }


    const newAccessToken = jwt.sign({ id : decoded.id}, "SECRET_ACCESS_KEY", { expiresIn : "45s"})
    return res.status(201).json({
        message : "success",
        id : user._id,
        username : user.username,
        email : user.email,
        accessToken : newAccessToken,
    })

    let newRefreshToken = jwt.sign({ id : user._id }, "SECRET_REFRESH_KEY", { expiresIn : '7d' });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly :true, //so refresh token isn't accessible through Javascript
        // path
    })
    // we also create a new refreshtoken and set it to cookie


    
}

export const getCurrentUser = (req : Request, res : Response) => {
    console.log(req.user)
    res.status(201).json({user : req.user || null })
}
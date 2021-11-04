import { Request, Response, NextFunction } from "express"
interface ErrorMessage {
    message : string;
}

export const errorHandler = (err : Error, req : Request, res : Response, next : NextFunction) => {
    const code = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(code);
    res.json({
        message : err.message 
    })
}
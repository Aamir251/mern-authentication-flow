"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var MONGO_URL = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.h0dn7.mongodb.net/JWT?retryWrites=true&w=majority";
exports.default = (function () {
    mongoose_1.default.connect(MONGO_URL).then(function () {
        console.log("Database Connected");
    });
});

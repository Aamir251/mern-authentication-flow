"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var connectDB_1 = __importDefault(require("./connectDB"));
var app = (0, express_1.default)();
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var PORT = process.env.PORT || 5000;
//connecting to database
(0, connectDB_1.default)();
app.use("/user", userRoutes_1.default);
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});

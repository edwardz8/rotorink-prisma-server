"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createAccessToken = exports.comparePassword = exports.hashPassword = exports.prisma = exports.envs = exports.isDev = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const isDev = () => process.env.NODE_ENV === 'development';
exports.isDev = isDev;
exports.envs = {
    PORT: process.env.PORT || 8000,
    HOST: process.env.HOST || 'http://localhost',
    CORS_HOST: process.env.CORS_HOST || 'http://192.168.86.211:19000/',
    JWT_SECRET: process.env.JWT_SECRET || 'secret123483947389743847389473897',
};
exports.prisma = new client_1.PrismaClient();
const hashPassword = (password) => {
    let salt = (0, bcrypt_1.genSaltSync)(10);
    return new Promise(res => {
        (0, bcrypt_1.hash)(password, salt, (err, saltedPassword) => {
            res(saltedPassword);
        });
    });
};
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => {
    return new Promise(res => {
        (0, bcrypt_1.compare)(password, hashedPassword, (err, same) => {
            if (err)
                res(false);
            else
                res(same);
        });
    });
};
exports.comparePassword = comparePassword;
const createAccessToken = (data) => {
    return new Promise((res, rej) => {
        jwt.sign(data, exports.envs.JWT_SECRET, {}, (err, token) => {
            if (err)
                rej(err);
            res(token);
        });
    });
};
exports.createAccessToken = createAccessToken;
const verifyToken = (token) => {
    return new Promise((res, rej) => {
        if (!token) {
            rej('invalid token');
            return;
        }
        jwt.verify(token, exports.envs.JWT_SECRET, {}, (err, decoded) => {
            if (err) {
                rej('invalid token');
                return;
            }
            res(decoded);
        });
    });
};
exports.verifyToken = verifyToken;

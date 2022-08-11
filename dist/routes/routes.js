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
exports.renderRoutes = void 0;
const controllers = __importStar(require("../controllers"));
const routes = {
    healthCheck: {
        method: 'GET',
        url: '/health',
        handler: (_, res) => {
            res.status(200).send();
        },
    },
    signup: {
        method: 'POST',
        url: '/signup',
        handler: controllers.signup,
    },
    login: {
        method: 'POST',
        url: '/login',
        handler: controllers.login,
    },
    getAllPlayers: {
        method: 'GET',
        url: '/players',
        handler: controllers.getAllPlayers,
    },
    getPlayer: {
        method: 'GET',
        url: '/players/:id',
        handler: controllers.getPlayer,
    },
    getAllUsers: {
        method: 'GET',
        url: '/users',
        // preHandler: [middleware.validateRequest],
        handler: controllers.getAllUsers,
    },
};
exports.renderRoutes = Object.values(routes);

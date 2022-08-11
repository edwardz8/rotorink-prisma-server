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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const dotenv = __importStar(require("dotenv"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const utils_1 = require("./helpers/utils");
const sensible_1 = __importDefault(require("@fastify/sensible"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("./routes");
dotenv.config();
const client_1 = require("@prisma/client");
const app = (0, fastify_1.default)({
    logger: { level: (0, utils_1.isDev)() ? 'info' : 'warn' },
});
exports.app = app;
app.register(sensible_1.default);
app.register(helmet_1.default);
app.register(cors_1.default, { credentials: true, origin: utils_1.envs.CORS_HOST });
app.register(routes_1.router);
const prisma = new client_1.PrismaClient();
app.get('/', (req, reply) => {
    reply.send({ hello: 'from rotorink index route' });
});
/* app.get('/players', async (req, res) => {
   return await commitToDb(prisma.player.findMany({ select: {
        id: true,
        name: true,
        team: true,
        goals: true,
        assists: true,
        fanpoints: true
    }
 }))
}) */
/* async function commitToDb(promise) {
   const [error, data] = await app.to(promise)
   if (error) return app.httpErrors.internalServerError(error.message)
   return data
} */
app.listen(8000, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`server listening on port ${address}`);
});

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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Require the framework
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const sensible_1 = __importDefault(require("@fastify/sensible"));
const client_1 = require("@prisma/client");
// Instantiate Fastify with some config
const app = (0, fastify_1.default)({
    logger: true,
});
app.register(sensible_1.default);
// app.register(cookie, { secret: process.env.COOKIE_SECRET })
app.register(cors_1.default, {
    origin: process.env.CLIENT_URL,
    credentials: true,
});
/* middleware */
/* app.addHook('onRequest', (req, res, done) => {
    if (req.cookies.userId !== CURRENT_USER_ID) {
        req.cookies.userId = CURRENT_USER_ID
        res.clearCookie("userId")
        res.setCookie("userId", CURRENT_USER_ID)
    }
    done()
})
 */
const prisma = new client_1.PrismaClient();
/* const CURRENT_USER_ID = (
    await prisma.user.findFirst({ where: { name: "" } })
).id  */
const COMMENT_SELECT_FIELDS = {
    id: true,
    message: true,
    parentId: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            name: true,
        }
    }
};
/* get all players */
app.get('/players', async (req, res) => {
    return await commitToDb(prisma.player.findMany({ select: {
            id: true,
            name: true,
            team: true,
            goals: true,
            assists: true,
            content: true,
            fanpoints: true
        }
    }));
});
/* get single player */
app.get('/players/:id', async (req, res) => {
    return await commitToDb(prisma.player.findUnique({
        select: {
            id: true,
            name: true,
            team: true,
            goals: true,
            assists: true,
            content: true,
            fanpoints: true,
            comments: {
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    ...COMMENT_SELECT_FIELDS,
                }
            },
            likes: {
                orderBy: {
                    userId: 'desc'
                },
                select: {
                    _count: { select: { likes: true } }
                }
            }
        }
    })
        .then(async (player) => {
        const likes = await prisma.like.findMany({
            where: {
                userId: req.cookies.userId,
                commentId: { in: player.comments.map(comment => comment.id) }
            }
        });
        return {
            ...player,
            comments: player.comments.map(comment => {
                const { _count, ...commentFields } = comment;
                return {
                    ...commentFields,
                    likedByMe: likes.find(like => like.commentId === comment.id),
                    likeCount: _count.likes
                };
            })
        };
    }));
});
/* comments on a player */
app.post("/players/:id/comments", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"));
    }
    return await commitToDb(prisma.comment.create({
        data: {
            message: req.body.message,
            userId: req.cookies.userId,
            parentId: req.body.parentId,
            playerId: req.params.id
        },
        select: COMMENT_SELECT_FIELDS
    })
        .then(comment => {
        return {
            ...comment,
            likeCount: 0,
            likedByMe: false
        };
    }));
});
/* individual comment on a player */
app.put("/players/:playerId/comments/:commentId", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"));
    }
    const { userId } = await prisma.comment.findUnique({
        where: { id: req.params.commentId },
        select: { userId: true },
    });
    if (userId !== req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("You do not have permission to edit this message"));
    }
    return await commitToDb(prisma.comment.update({
        where: { id: req.params.commentId },
        data: { message: req.body.message },
        select: { message: true },
    }));
});
/* delete comment from a player */
app.delete("/players/:playerId/comments/:commentId", async (req, res) => {
    const { userId } = await prisma.comment.findUnique({
        where: { id: req.params.commentId },
        select: { userId: true },
    });
    if (userId !== req.cookies.userId) {
        return res.send(app.httpErrors.unauthorized("You do not have permission to delete this message"));
    }
    return await commitToDb(prisma.comment.delete({
        where: { id: req.params.commentId },
        select: { id: true },
    }));
});
/* like and unlike player */
app.post("/players/:playerId/comments/:commentId/toggleLike", async (req, res) => {
    const data = {
        commentId: req.params.commentId,
        userId: req.cookies.userId,
    };
    const like = await prisma.like.findUnique({
        where: { userId_commentId: data },
    });
    if (like == null) {
        return await commitToDb(prisma.like.create({ data })).then(() => {
            return { addLike: true };
        });
    }
    else {
        return await commitToDb(prisma.like.delete({ where: { userId_commentId: data } })).then(() => {
            return { addLike: false };
        });
    }
});
async function commitToDb(promise) {
    const [error, data] = await app.to(promise);
    if (error)
        return app.httpErrors.internalServerError(error.message);
    return data;
}
// Register your application as a normal plugin.
// app.register(import("../server"));
exports.default = async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
};

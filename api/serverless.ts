"use strict";

import * as dotenv from "dotenv";
import sensible from '@fastify/sensible'
import cors from '@fastify/cors';
import fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet'
import { isDev, envs } from '../helpers/utils'
import { router } from '../routes'

dotenv.config()

import { PrismaClient } from '@prisma/client'

const app: FastifyInstance = fastify({
    logger: { level: isDev() ? 'info' : 'warn' },
})

app.register(sensible)
app.register(helmet)
app.register(cors, { credentials: true, origin: envs.CORS_HOST })
app.register(router)

const prisma = new PrismaClient()

app.get('/', (req, reply) => {
    reply.send({ hello: 'from rotorink index route' })
})


/* const COMMENT_SELECT_FIELDS = {
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
} */

/* get all players */
/* app.get('/players', async (req, res) => {
   return await commitToDb(prisma.player.findMany({ select: {
        id: true,
        name: true,
        team: true, 
        goals: true, 
        assists: true,
        content: true,
        fanpoints: true 
    }
 }))
}) */


/* comments on a player */
/* app.post("/players/:id/comments", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"))
    }

    return await commitToDb(
        prisma.comment.create({
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
            }
        })
    )
}) */

/* individual comment on a player */
/* app.put("/players/:playerId/comments/:commentId", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
      return res.send(app.httpErrors.badRequest("Message is required"))
    }
  
    const { userId } = await prisma.comment.findUnique({
      where: { id: req.params.commentId },
      select: { userId: true },
    })
    if (userId !== req.cookies.userId) {
      return res.send(
        app.httpErrors.unauthorized(
          "You do not have permission to edit this message"
        )
      )
    }
  
    return await commitToDb(
      prisma.comment.update({
        where: { id: req.params.commentId },
        data: { message: req.body.message },
        select: { message: true },
      })
    )
  }) */
  
  /* delete comment from a player */
/*   app.delete("/players/:playerId/comments/:commentId", async (req, res) => {
    const { userId } = await prisma.comment.findUnique({
      where: { id: req.params.commentId },
      select: { userId: true },
    })
    if (userId !== req.cookies.userId) {
      return res.send(
        app.httpErrors.unauthorized(
          "You do not have permission to delete this message"
        )
      )
    }
  
    return await commitToDb(
      prisma.comment.delete({
        where: { id: req.params.commentId },
        select: { id: true },
      })
    )
  }) */
  
  /* like and unlike player */
/*   app.post("/players/:playerId/comments/:commentId/toggleLike", async (req, res) => {
    const data = {
      commentId: req.params.commentId,
      userId: req.cookies.userId,
    }
  
    const like = await prisma.like.findUnique({
      where: { userId_commentId: data },
    })
  
    if (like == null) {
      return await commitToDb(prisma.like.create({ data })).then(() => {
        return { addLike: true }
      })
    } else {
      return await commitToDb(
        prisma.like.delete({ where: { userId_commentId: data } })
      ).then(() => {
        return { addLike: false }
      })
    }
  }) */



/* async function commitToDb(promise) {
   const [error, data] = await app.to(promise)
   if (error) return app.httpErrors.internalServerError(error.message)
   return data 
} */

// Register your application as a normal plugin.
// app.register(import("../server"));

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}
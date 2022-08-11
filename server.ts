import fastify, { FastifyInstance } from 'fastify';
import * as dotenv from "dotenv";
import sensible from '@fastify/sensible'

dotenv.config()

import { PrismaClient } from '@prisma/client'

const app: FastifyInstance = fastify({
    logger: true 
})

app.register(sensible)

const prisma = new PrismaClient()

app.get('/', (req, reply) => {
    reply.send({ hello: 'from rotorink index route' })
})

app.get('/players', async (req, res) => {
   return await commitToDb(prisma.player.findMany({ select: {
        id: true,
        name: true,
        team: true, 
        goals: true, 
        assists: true, 
        fanpoints: true 
    }
 }))
})

async function commitToDb(promise) {
   const [error, data] = await app.to(promise)
   if (error) return app.httpErrors.internalServerError(error.message)
   return data 
}

app.listen(8000, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`server listening on port ${address}`)
})

// app.listen({ port: process.env.PORT || 8081 })
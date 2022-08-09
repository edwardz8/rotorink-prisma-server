import fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'

import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = fastify()
app.register(sensible)
app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true,
})

const prisma = new PrismaClient()

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

app.listen({ port: process.env.PORT || 8081 })
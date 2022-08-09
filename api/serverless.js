"use strict";

import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify from "fastify";

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});


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

// Register your application as a normal plugin.
app.register(import("../server"));

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}
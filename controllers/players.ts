import { RouteHandlerMethod } from 'fastify'
import { prisma } from '../helpers/utils'

export const getAllPlayers: RouteHandlerMethod = async (req, res) => {
    try {
        let players = await prisma.player.findMany({
            select: {
                id: true,
                name: true,
                team: true,
                goals: true,
                assists: true,
                content: true,
                fanpoints: true
            },
        })
        return res.send({ data: { players } })
    } catch (error) {
        console.error('players', error)
        res.status(500).send({ error: `Cannot fetch players` })
    }
}
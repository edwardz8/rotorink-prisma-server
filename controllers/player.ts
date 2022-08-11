import { RouteHandlerMethod } from 'fastify'
import { url } from 'inspector'
import { prisma } from '../helpers/utils'

/* get single player */
export const getPlayer: RouteHandlerMethod = async (req, res) => {
    try {
        let player = await prisma.player.findUnique({
            where: { id: req.url },
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
        return res.send({ data: { player } })
    } catch (error) {
        console.error('player', error)
        res.status(500).send({ error: `Cannot fetch player` })
    }
}
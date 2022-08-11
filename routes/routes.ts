import { RouteOptions } from 'fastify'
import * as controllers from '../controllers'
import * as middleware from '../middleware'

type RouteConfig = Record<string, RouteOptions>

const routes: RouteConfig = {
  healthCheck: {
    method: 'GET',
    url: '/health',
    handler: (_, res) => {
      res.status(200).send()
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
}

export const renderRoutes = Object.values(routes)
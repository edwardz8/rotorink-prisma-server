"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const routes_1 = require("./routes");
const router = (fastify, opts, next) => {
    fastify.decorateRequest('user', null);
    fastify.addHook('onRequest', (req, res, next) => {
        console.log('onRequest');
        req.id = null;
        next();
    });
    for (let route of routes_1.renderRoutes) {
        fastify.route(route);
    }
    next();
};
exports.router = router;

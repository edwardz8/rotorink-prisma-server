"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const utils_1 = require("./helpers/utils");
const start = async () => {
    await server_1.app.listen(utils_1.envs.PORT);
    server_1.app.log.info(`app running on ${utils_1.envs.HOST}:${utils_1.envs.PORT}/`);
};
start();

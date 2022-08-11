"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlayers = void 0;
const utils_1 = require("../helpers/utils");
const getAllPlayers = async (req, res) => {
    try {
        let players = await utils_1.prisma.player.findMany({
            select: {
                id: true,
                name: true,
                team: true,
                goals: true,
                assists: true,
                content: true,
                fanpoints: true
            },
        });
        return res.send({ data: { players } });
    }
    catch (error) {
        console.error('players', error);
        res.status(500).send({ error: `Cannot fetch players` });
    }
};
exports.getAllPlayers = getAllPlayers;

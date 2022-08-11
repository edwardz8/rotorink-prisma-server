"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayer = void 0;
const utils_1 = require("../helpers/utils");
/* get single player */
const getPlayer = async (req, res) => {
    try {
        let player = await utils_1.prisma.player.findUnique({
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
        });
        return res.send({ data: { player } });
    }
    catch (error) {
        console.error('player', error);
        res.status(500).send({ error: `Cannot fetch player` });
    }
};
exports.getPlayer = getPlayer;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const utils_1 = require("../helpers/utils");
const getAllUsers = async (req, res) => {
    try {
        let users = await utils_1.prisma.user.findMany({
            select: { name: true, email: true },
        });
        return res.send({ data: { users } });
    }
    catch (error) {
        console.error('users', error);
        res.status(500).send({ error: `Cannot fetch users` });
    }
};
exports.getAllUsers = getAllUsers;

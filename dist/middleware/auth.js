"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const utils_1 = require("../helpers/utils");
const validateRequest = async (req, res) => {
    try {
        let auth = req.headers['authorization'];
        let token = auth?.replace('Bearer ', '');
        let user = await (0, utils_1.verifyToken)(token);
        req.id = user;
    }
    catch (error) {
        return res.status(401).send({ error: 'Unauthorized!' });
    }
};
exports.validateRequest = validateRequest;

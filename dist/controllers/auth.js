"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const errors_1 = require("../helpers/errors");
const utils_1 = require("../helpers/utils");
const signup = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        password = await (0, utils_1.hashPassword)(password);
        let { password: pass, ...user } = await utils_1.prisma.user.create({
            data: { name, email, password },
        });
        res.send({ data: { user } });
    }
    catch (error) {
        res.status(400).send({ error: `User already exists!` });
        (0, errors_1.logError)('signup', error);
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await utils_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        if (!(await (0, utils_1.comparePassword)(password, user.password))) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        let { password: pass, ...data } = user;
        return res.send({
            data: { user: data, accessToken: await (0, utils_1.createAccessToken)(data) },
        });
    }
    catch (error) {
        res.status(500).send({ error: 'Server error!' });
        (0, errors_1.logError)('login', error);
    }
};
exports.login = login;

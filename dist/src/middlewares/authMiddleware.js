"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        if (token) {
            const validToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            req.username = validToken.username;
            // console.log(validToken)
            next();
        }
    }
    catch (error) {
        res.status(401).json({ error });
        return;
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.username;
    if (!username) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: {
                username
            },
            include: {
                roles: true
            }
        });
        if (!existingUser) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (existingUser.roles.some(role => role.name === "ROLE_ADMIN")) {
            next();
        }
        else {
            res.status(403).json({ error: "Forbidden" });
        }
    }
    catch (error) {
    }
});
exports.isAdmin = isAdmin;
//# sourceMappingURL=authMiddleware.js.map
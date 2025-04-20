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
exports.login = exports.register = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RegisterUserSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty({ message: "Name is required" }),
    username: zod_1.z.string().nonempty({ message: "Username is required" }),
    email: zod_1.z.string().nonempty({ message: "Email is required" }).email(),
    password: zod_1.z.string().nonempty({ message: "Password is required" }),
});
const LoginUserSchema = RegisterUserSchema.pick({ password: true }).extend({
    usernameOrEmail: zod_1.z
        .string()
        .nonempty({ message: "Username or email is required" }),
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedFields = RegisterUserSchema.safeParse(req.body);
    if (!validatedFields.success) {
        res.status(400).json({ message: validatedFields.error });
        return;
    }
    const { username, email, password } = validatedFields.data;
    try {
        const existingUser = yield prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma_1.prisma.user.create({
            data: Object.assign(Object.assign({}, validatedFields.data), { password: hashedPassword, roles: {
                    connectOrCreate: {
                        where: {
                            name: "ROLE_USER",
                        },
                        create: {
                            name: "ROLE_USER",
                        },
                    },
                } }),
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("login");
    console.log(req.body);
    const validatedFields = LoginUserSchema.safeParse(req.body);
    if (!validatedFields.success) {
        res.status(400).json({ message: validatedFields.error });
        return;
    }
    const { usernameOrEmail, password } = validatedFields.data;
    try {
        // const existingUser = await prisma.user.findUnique({
        //     where: {
        //         username
        //     }
        // })
        const existingUser = yield prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            },
            include: {
                roles: true,
            },
        });
        console.log(existingUser);
        if (!existingUser) {
            res.status(401).json({ message: "Incorrect username or password" });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(401).json({ message: "Incorrect username or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: existingUser.id,
            username: existingUser.username,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.status(200).json({
            accessToken: token,
            role: (_a = existingUser.roles[0]) === null || _a === void 0 ? void 0 : _a.name,
        });
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.login = login;
//# sourceMappingURL=auth.js.map
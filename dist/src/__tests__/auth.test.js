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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const seed_1 = require("../../prisma/seed");
// interface User {
//     // id: number,
//     name: string,
//     username: string,
//     email: string,
//     password: string
// }
// let initialReturnedUsers: User[]
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clear the todos table
    yield prisma_1.prisma.user.deleteMany();
    yield prisma_1.prisma.role.deleteMany();
    // Insert test data
    yield (0, seed_1.seedUsers)();
}));
const api = (0, supertest_1.default)(__1.app);
describe('POST /api/auth/register', () => {
    test('Registers a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const initialPassword = bcrypt_1.default.hashSync(process.env.INITIAL_PASSWORD_TEST, 10);
        const initialReturnedUsers = yield prisma_1.prisma.user.findMany();
        const user = {
            name: "david",
            username: "david",
            email: "david@gmail.com",
            password: initialPassword
        };
        const response = yield api
            .post('/api/auth/register')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const users = yield prisma_1.prisma.user.findMany();
        // Check that we have created something and now there is one more record in database
        expect(users.length).toEqual(initialReturnedUsers.length + 1);
        const _a = response.body, { id } = _a, restBody = __rest(_a, ["id"]);
        const { password } = user, restUser = __rest(user
        // Check that we get the same todo as the one passed in the request body
        , ["password"]);
        // Check that we get the same todo as the one passed in the request body
        expect(restBody).toEqual(restUser);
    }));
});
describe('POST /api/auth/login', () => {
    it('returns JWT token with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .post('/api/auth/login')
            .send({
            usernameOrEmail: 'admin',
            password: '1234'
        })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        // Check response structure
        expect(response.body).toHaveProperty('accessToken');
        // Verify token is valid JWT
        const decodedToken = jsonwebtoken_1.default.verify(response.body.accessToken, process.env.JWT_SECRET_KEY);
        expect(decodedToken).toHaveProperty('username', 'admin');
        // expect(decodedToken).toHaveProperty('id')
    }));
    it('allows login with email instead of username', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .post('/api/auth/login')
            .send({
            usernameOrEmail: 'admin@gmail.com',
            password: '1234'
        })
            .expect(200);
        expect(response.body).toHaveProperty('accessToken');
    }));
    it('returns 401 with invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .post('/api/auth/login')
            .send({
            usernameOrEmail: 'testuser',
            password: 'wrongpass'
        })
            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(res => {
            expect(res.body).toHaveProperty('error');
        });
    }));
    it('returns 401 with non-existent user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .post('/api/auth/login')
            .send({
            usernameOrEmail: 'nonexistent',
            password: 'testpass123'
        })
            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(res => {
            expect(res.body).toHaveProperty('error');
        });
    }));
    it('returns 400 with missing credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .post('/api/auth/login')
            .send({})
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect(res => {
            expect(res.body).toHaveProperty('error');
        });
    }));
});
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.server.close();
}));
//# sourceMappingURL=auth.test.js.map
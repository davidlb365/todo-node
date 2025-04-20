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
const seed_1 = require("../../prisma/seed");
const api = (0, supertest_1.default)(__1.app);
const initialTodos = [
    {
        title: "Test todo 1",
        description: "Test description 1",
        completed: false
    },
    {
        title: "Test todo 2",
        description: "Test description 2",
        completed: true
    }
];
let initialReturnedTodos;
let testId;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clear the tables
    yield prisma_1.prisma.todo.deleteMany();
    yield prisma_1.prisma.user.deleteMany(),
        yield prisma_1.prisma.role.deleteMany(),
        // Insert test data
        initialReturnedTodos = yield prisma_1.prisma.todo.createManyAndReturn({
            data: initialTodos
        });
    testId = initialReturnedTodos[initialReturnedTodos.length - 1].id;
    // seed Users
    yield (0, seed_1.seedUsers)();
}));
describe('GET /api/todos', () => {
    test('returns all todos', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .get('/api/todos')
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body).toHaveLength(initialTodos.length);
        // const todosWithoutId = response.body.map(({ id, ...rest }: Todo) => rest)
        // expect(todosWithoutId).toEqual(initialTodos)
        // Check that we get all the todos that we inserted previously
        expect(response.body).toEqual(initialReturnedTodos);
    }));
});
describe('POST /api/todos', () => {
    test('Add a new todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const todo = {
            title: 'Test todo 3',
            description: 'Test description 3',
            completed: false,
        };
        const response = yield api
            .post('/api/todos')
            .send(todo)
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            //   .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(201);
        // expect(users.body).toHaveProperty('data.user')
        // expect(users.body.data.user).toEqual({
        //   id: 1,
        //   email: 'user@g.com',
        //   name: 'User',
        // })
        const todos = yield prisma_1.prisma.todo.findMany();
        // Check that we have created something and now there is one more record in database
        expect(todos.length).toEqual(initialReturnedTodos.length + 1);
        const _a = response.body, { id } = _a, rest = __rest(_a, ["id"]);
        // Check that we get the same todo as the one passed in the request body
        expect(rest).toEqual(todo);
    }));
});
describe('GET /api/todos/:id', () => {
    it('returns a todo by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .get(`/api/todos/${testId}`)
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const todo = initialTodos[initialTodos.length - 1];
        // Check that we get the same todo as the one previously inserted with the same id
        expect(response.body).toEqual(Object.assign(Object.assign({}, todo), { id: testId }));
    }));
});
describe('PUT /api/todos/:id', () => {
    it('Returns updated todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const todo = {
            title: 'Test todo 2 U',
            description: 'Test description 2 U',
            completed: false,
        };
        const response = yield api
            .put(`/api/todos/${testId}`)
            .send(todo)
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            .expect('Content-Type', /application\/json/)
            .expect(200);
        // Check that we obtain an object with the same id as the id passed
        expect(response.body.id).toEqual(testId);
        // Check that we obtain an object equal to the todo passed in the request body
        expect(response.body).toEqual(Object.assign(Object.assign({}, todo), { id: testId }));
    }));
});
describe('DELETE /api/todos/:id', () => {
    it('deletes a todo by id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .delete(`/api/todos/${testId}`)
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const todos = yield prisma_1.prisma.todo.findMany();
        // Check that we have deleted something and now there is one less record in database
        expect(todos.length).toEqual(initialReturnedTodos.length - 1);
        const existsTodo = todos.some(t => t.id === testId);
        // Check that we cannot find the record with the given id
        expect(existsTodo).toBeFalsy();
    }));
});
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.server.close();
}));
//# sourceMappingURL=todos.test.js.map
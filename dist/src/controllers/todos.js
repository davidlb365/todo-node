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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.incompleteTodo = exports.completeTodo = exports.updateTodo = exports.getTodoById = exports.getAllTodos = exports.addTodo = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const TodoSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty("Title is required"),
    description: zod_1.z.string().nonempty("Description is required"),
    completed: zod_1.z.boolean().optional(),
});
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedTodo = TodoSchema.safeParse(req.body);
    if (!validatedTodo.success) {
        res.status(400).json({ message: validatedTodo.error });
        return;
    }
    try {
        const todo = yield prisma_1.prisma.todo.create({
            data: validatedTodo.data,
        });
        res.status(201).json(todo);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.addTodo = addTodo;
const getAllTodos = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma_1.prisma.todo.findMany({
            orderBy: {
                id: "asc",
            },
        });
        res.json(todos);
        return;
    }
    catch (error) {
        res.status(500).json({ message: error });
        return;
    }
});
exports.getAllTodos = getAllTodos;
const getTodoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const todo = yield prisma_1.prisma.todo.findUnique({
            where: {
                id,
            },
        });
        if (!todo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        res.json(todo);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.getTodoById = getTodoById;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedTodo = TodoSchema.safeParse(req.body);
    if (!validatedTodo.success) {
        res.status(400).json({ message: validatedTodo.error });
        return;
    }
    const id = parseInt(req.params.id);
    try {
        const foundTodo = yield prisma_1.prisma.todo.findUnique({
            where: {
                id,
            },
        });
        if (!foundTodo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        const todo = yield prisma_1.prisma.todo.update({
            where: {
                id,
            },
            data: validatedTodo.data,
        });
        res.status(200).json(todo);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.updateTodo = updateTodo;
const completeTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const foundTodo = yield prisma_1.prisma.todo.findUnique({
            where: {
                id,
            },
        });
        if (!foundTodo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        const todo = yield prisma_1.prisma.todo.update({
            where: {
                id,
            },
            data: {
                completed: true,
            },
        });
        res.json(todo);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.completeTodo = completeTodo;
const incompleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const foundTodo = yield prisma_1.prisma.todo.findUnique({
            where: {
                id,
            },
        });
        if (!foundTodo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        const todo = yield prisma_1.prisma.todo.update({
            where: {
                id,
            },
            data: {
                completed: false,
            },
        });
        res.json(todo);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.incompleteTodo = incompleteTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const foundTodo = yield prisma_1.prisma.todo.findUnique({
            where: {
                id,
            },
        });
        if (!foundTodo) {
            res.status(404).json({ message: "Todo not found" });
            return;
        }
        yield prisma_1.prisma.todo.delete({
            where: {
                id,
            },
        });
        res.json({ message: "Todo deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.deleteTodo = deleteTodo;
//# sourceMappingURL=todos.js.map
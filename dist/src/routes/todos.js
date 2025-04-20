"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todosRouter = void 0;
const express_1 = __importDefault(require("express"));
const todos_1 = require("../controllers/todos");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.todosRouter = express_1.default.Router();
exports.todosRouter.post("/", authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, todos_1.addTodo);
exports.todosRouter.get("/", authMiddleware_1.verifyToken, todos_1.getAllTodos);
exports.todosRouter.get("/:id", authMiddleware_1.verifyToken, todos_1.getTodoById);
exports.todosRouter.put("/:id", authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, todos_1.updateTodo);
exports.todosRouter.patch("/:id/complete", authMiddleware_1.verifyToken, todos_1.completeTodo);
exports.todosRouter.patch("/:id/incomplete", authMiddleware_1.verifyToken, todos_1.incompleteTodo);
exports.todosRouter.delete("/:id", authMiddleware_1.verifyToken, authMiddleware_1.isAdmin, todos_1.deleteTodo);
//# sourceMappingURL=todos.js.map
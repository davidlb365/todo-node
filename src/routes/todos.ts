import express from "express";
import { addTodo, completeTodo, deleteTodo, getAllTodos, getTodoById, incompleteTodo, updateTodo } from "../controllers/todos";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware";

export const todosRouter = express.Router()

todosRouter.post("/", verifyToken, isAdmin, addTodo)
todosRouter.get("/", verifyToken, getAllTodos)
todosRouter.get("/:id", verifyToken, getTodoById)
todosRouter.put("/:id", verifyToken, isAdmin, updateTodo)
todosRouter.patch("/:id/complete", verifyToken, completeTodo)
todosRouter.patch("/:id/incomplete", verifyToken, incompleteTodo)
todosRouter.delete("/:id", verifyToken, isAdmin, deleteTodo)
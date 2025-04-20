import { Request, RequestHandler, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const TodoSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  completed: z.boolean().optional(),
});

export const addTodo: RequestHandler = async (req: Request, res: Response) => {
  const validatedTodo = TodoSchema.safeParse(req.body);

  if (!validatedTodo.success) {
    res.status(400).json({ message: validatedTodo.error });
    return;
  }
  try {
    const todo = await prisma.todo.create({
      data: validatedTodo.data,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getAllTodos = async (_req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.json(todos);
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const validatedTodo = TodoSchema.safeParse(req.body);

  if (!validatedTodo.success) {
    res.status(400).json({ message: validatedTodo.error });
    return;
  }

  const id = parseInt(req.params.id);

  try {
    const foundTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    if (!foundTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: validatedTodo.data,
    });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const completeTodo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const foundTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    if (!foundTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        completed: true,
      },
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const incompleteTodo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const foundTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    if (!foundTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    const todo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        completed: false,
      },
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const foundTodo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });
    if (!foundTodo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    await prisma.todo.delete({
      where: {
        id,
      },
    });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

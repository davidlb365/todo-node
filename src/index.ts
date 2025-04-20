import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { todosRouter } from "./routes/todos";
import { authRouter } from "./routes/auth";

export const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4200"],
  })
);

// const tasks: { name: string, isDone?: boolean }[] = [
//     {
//         name: 'task 1',
//         isDone: false
//     },
//     {
//         name: 'task 2'
//     },
//     {
//         name: 'task 3'
//     }
// ]

app.get("/", (_req: Request, res: Response) => {
  res.send("Express Typescript on Vercel");
  return;
});

app.use("/api/todos", todosRouter);
app.use("/api/auth", authRouter);

export const server = app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

export default app;

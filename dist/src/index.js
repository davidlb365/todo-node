"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const todos_1 = require("./routes/todos");
const auth_1 = require("./routes/auth");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:4200"],
}));
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
exports.app.get("/", (_req, res) => {
    res.send("Express Typescript on Vercel");
    return;
});
exports.app.use("/api/todos", todos_1.todosRouter);
exports.app.use("/api/auth", auth_1.authRouter);
exports.server = exports.app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
//# sourceMappingURL=index.js.map
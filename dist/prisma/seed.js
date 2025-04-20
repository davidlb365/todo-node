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
exports.seedUsers = seedUsers;
const prisma_1 = require("../src/lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
function seedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const password = yield bcrypt_1.default.hash(process.env.ADMIN_PASS, 10);
        yield prisma_1.prisma.user.upsert({
            where: { username: 'admin' },
            update: {
                roles: {
                    connectOrCreate: {
                        where: {
                            name: 'ROLE_ADMIN'
                        },
                        create: {
                            name: 'ROLE_ADMIN'
                        }
                    }
                }
            },
            create: {
                name: 'Admin',
                username: 'admin',
                email: 'admin@gmail.com',
                password: password,
                roles: {
                    connectOrCreate: {
                        where: {
                            name: 'ROLE_ADMIN'
                        },
                        create: {
                            name: 'ROLE_ADMIN'
                        }
                    }
                }
            }
        });
        // const todo1 = await prisma.todo.createMany({
        //     data: [
        //         {
        //             title: 'Todo 1',
        //             description: 'Todo 1 description',
        //             completed: false
        //         },
        //         {
        //             title: 'Todo 2',
        //             description: 'Todo 2 description',
        //             completed: false
        //         }
        //     ]
        // })
        // console.log({ admin, todo1 })
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        seedUsers();
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_1.prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map
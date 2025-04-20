"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// const databaseUrl = process.env.NODE_ENV === 'test' 
//   ? process.env.DATABASE_URL_TEST 
//   : process.env.DATABASE_URL
exports.prisma = new client_1.PrismaClient(
// {
//   datasources: {
//     db: {
//       url: databaseUrl
//     }
//   }
// }
);
//# sourceMappingURL=prisma.js.map
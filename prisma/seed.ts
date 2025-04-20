import { prisma } from "../src/lib/prisma"
import bcrypt from 'bcrypt'

export async function seedUsers() {
    const password = await bcrypt.hash(process.env.ADMIN_PASS as string, 10);
    await prisma.user.upsert({
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
    })

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
}

async function main() {
    seedUsers()
}
main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})
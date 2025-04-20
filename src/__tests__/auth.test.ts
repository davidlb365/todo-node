import supertest from "supertest";
import { app, server } from "..";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { seedUsers } from "../../prisma/seed";

// interface User {
//     // id: number,
//     name: string,
//     username: string,
//     email: string,
//     password: string
// }

// let initialReturnedUsers: User[]

beforeEach(async () => {
    // Clear the todos table
    await prisma.user.deleteMany()
    await prisma.role.deleteMany()
    
    // Insert test data
    await seedUsers()
})

const api = supertest(app)

describe('POST /api/auth/register', () => {
    test('Registers a new user', async () => {

        const initialPassword = bcrypt.hashSync(process.env.INITIAL_PASSWORD_TEST as string, 10)

        const initialReturnedUsers = await prisma.user.findMany()

        const user = {
            name: "david",
            username: "david",
            email: "david@gmail.com",
            password: initialPassword
        }
        const response = await api
            .post('/api/auth/register')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const users = await prisma.user.findMany()
        // Check that we have created something and now there is one more record in database
        expect(users.length).toEqual(initialReturnedUsers.length+1)
    
        const {id, ...restBody} = response.body
        const {password, ...restUser} = user

        // Check that we get the same todo as the one passed in the request body
        expect(restBody).toEqual(restUser)
    })
})


describe('POST /api/auth/login', () => {

    it('returns JWT token with valid credentials', async () => {
        const response = await api
            .post('/api/auth/login')
            .send({
                usernameOrEmail: 'admin',
                password: '1234'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // Check response structure
        expect(response.body).toHaveProperty('accessToken')
        
        // Verify token is valid JWT
        const decodedToken = jwt.verify(response.body.accessToken, process.env.JWT_SECRET_KEY as string)
        expect(decodedToken).toHaveProperty('username', 'admin')
        // expect(decodedToken).toHaveProperty('id')
    })

    it('allows login with email instead of username', async () => {
        const response = await api
            .post('/api/auth/login')
            .send({
                usernameOrEmail: 'admin@gmail.com',
                password: '1234'
            })
            .expect(200)

        expect(response.body).toHaveProperty('accessToken')
    })

    it('returns 401 with invalid password', async () => {
        await api
            .post('/api/auth/login')
            .send({
                usernameOrEmail: 'testuser',
                password: 'wrongpass'
            })
            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(res => {
                expect(res.body).toHaveProperty('error')
            })
    })

    it('returns 401 with non-existent user', async () => {
        await api
            .post('/api/auth/login')
            .send({
                usernameOrEmail: 'nonexistent',
                password: 'testpass123'
            })
            .expect(401)
            .expect('Content-Type', /application\/json/)
            .expect(res => {
                expect(res.body).toHaveProperty('error')
            })
    })

    it('returns 400 with missing credentials', async () => {
        await api
            .post('/api/auth/login')
            .send({})
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect(res => {
                expect(res.body).toHaveProperty('error')
            })
    })
})


afterEach(async () => {
    await server.close()
})
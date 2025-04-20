import supertest from "supertest";
import { app, server } from "..";
import { prisma } from "../lib/prisma";
import { seedUsers } from "../../prisma/seed";
// import { prisma } from "../lib/prisma";

interface Todo {
    id: number,
    title: string,
    description: string,
    completed: boolean | null
}

const api = supertest(app)

const initialTodos = [
    {
        title: "Test todo 1",
        description: "Test description 1",
        completed: false
    },
    {
        title: "Test todo 2",
        description: "Test description 2",
        completed: true
    }
]

let initialReturnedTodos: Todo[]

let testId: number

beforeEach(async () => {
    // Clear the tables
    await prisma.todo.deleteMany()
    await prisma.user.deleteMany(),
    await prisma.role.deleteMany(),
    
    // Insert test data
    initialReturnedTodos = await prisma.todo.createManyAndReturn({
        data: initialTodos
    })
    testId = initialReturnedTodos[initialReturnedTodos.length-1].id

    // seed Users
    await seedUsers()
})

describe('GET /api/todos', () => {
    test('returns all todos', async () => {
        const response = await api
            .get('/api/todos')
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(initialTodos.length)

        // const todosWithoutId = response.body.map(({ id, ...rest }: Todo) => rest)
        // expect(todosWithoutId).toEqual(initialTodos)

        // Check that we get all the todos that we inserted previously
        expect(response.body).toEqual(initialReturnedTodos)
        
    })
})

describe('POST /api/todos', () => {
    test('Add a new todo', async () => {
        const todo = {
            title: 'Test todo 3',
            description: 'Test description 3',
            completed: false,
          }
        const response = await api
          .post('/api/todos')
          .send(todo)
          .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
        //   .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(201)
      
        // expect(users.body).toHaveProperty('data.user')
        // expect(users.body.data.user).toEqual({
        //   id: 1,
        //   email: 'user@g.com',
        //   name: 'User',
        // })

        const todos = await prisma.todo.findMany()
        // Check that we have created something and now there is one more record in database
        expect(todos.length).toEqual(initialReturnedTodos.length+1)
    
        const {id, ...rest} = response.body

        // Check that we get the same todo as the one passed in the request body
        expect(rest).toEqual(todo)
    })
})

describe('GET /api/todos/:id', () => {
    it('returns a todo by id', async () => {
        const response = await api
            .get(`/api/todos/${testId}`)
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const todo = initialTodos[initialTodos.length-1]

        // Check that we get the same todo as the one previously inserted with the same id
        expect(response.body).toEqual({...todo, id: testId})
    })
})

describe('PUT /api/todos/:id', () => {
    it('Returns updated todo', async () => {
        const todo = {
            title: 'Test todo 2 U',
            description: 'Test description 2 U',
            completed: false,
        }
        const response = await api
          .put(`/api/todos/${testId}`)
          .send(todo)
          .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
          .expect('Content-Type', /application\/json/)
          .expect(200)
    
        // Check that we obtain an object with the same id as the id passed
        expect(response.body.id).toEqual(testId)

        // Check that we obtain an object equal to the todo passed in the request body
        expect(response.body).toEqual({...todo, id: testId})
    })
})

describe('DELETE /api/todos/:id', () => {
    it('deletes a todo by id', async () => {
        await api
            .delete(`/api/todos/${testId}`)
            .set('authorization', `Bearer ${process.env.JWT_TOKEN_TEST_ADMIN}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const todos = await prisma.todo.findMany()

        // Check that we have deleted something and now there is one less record in database
        expect(todos.length).toEqual(initialReturnedTodos.length-1)

        const existsTodo = todos.some(t => t.id === testId)
        // Check that we cannot find the record with the given id
        expect(existsTodo).toBeFalsy()
    })
})

afterEach(async () => {
    await server.close()
})
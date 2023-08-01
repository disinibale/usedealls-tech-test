import request from 'supertest';
import { Express } from 'express';

import { faker } from '@faker-js/faker';
import { RegisterDto } from '../app/controllers/dto/auth.dto';
import createServer from '../server';
import userService from '../app/services/user.service';

describe('Authentication API', () => {
    let app: Express
    const userData = {
        fullname: `Unit Test ${new Date().toISOString()}`,
        email: `unit_${faker.person.lastName()}@mail.com`,
        password: 'password'
    } as RegisterDto

    console.log(userData, '<<<<<<<<<< USER DATA')

    beforeAll(async () => {
        app = await createServer()
    })

    afterAll(async () => {
        await userService.delete({ where: { email: userData.email } })
    })


    it('Should register a new user', async () => {
        const response = await request(app).post('/api/v1/auth/register').send(userData)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('data')
    })

    it('Should check if email is already registered', async () => {
        const response = await request(app).post('/api/v1/auth/register').send(userData)

        expect(response.statusCode).toBe(409)
        expect(response.body).toHaveProperty('error')
    })

    it('Should authenticate the created user', async () => {
        const response = await request(app).post('/api/v1/auth/login').send({ email: userData.email, password: userData.password })

        expect(response.statusCode).toBe(200)
        expect(response.statusCode).toMatchObject<{
            code: number,
            message: string,
            data: {
                token: string
            }
        }>
    })
})
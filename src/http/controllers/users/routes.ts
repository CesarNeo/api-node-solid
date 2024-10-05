import type { FastifyInstance } from 'fastify'
import { registerUser } from './register-user'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { refreshToken } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refreshToken)

  // Authenticated
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}

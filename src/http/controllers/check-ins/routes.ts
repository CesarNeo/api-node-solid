import { verifyJwt } from '@/http/middlewares/verify-jwt'
import type { FastifyInstance } from 'fastify'
import { createCheckIn } from './create'
import { validateCheckIn } from './validate'
import { checkInMetrics } from './metrics'
import { checkInHistory } from './history'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', checkInHistory)
  app.get('/check-ins/metrics', checkInMetrics)
  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch('/check-ins/:checkInId/validate', validateCheckIn)
}

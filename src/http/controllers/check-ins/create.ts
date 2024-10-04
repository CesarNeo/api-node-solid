import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { latitudeLongitudeValidation } from '@/utils/zod/validate-latitude-longitude'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createCheckInParamsSchema = z.object({
  gymId: z.string().uuid(),
})

const createCheckInBodySchema = latitudeLongitudeValidation

export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const createGymUseCase = makeCheckInUseCase()

  await createGymUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}

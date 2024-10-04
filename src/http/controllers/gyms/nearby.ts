import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const nearbyGymQuerySchema = z.object({
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

export async function nearbyGym(request: FastifyRequest, reply: FastifyReply) {
  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.body)

  const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase()
  const { gyms } = await fetchNearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}

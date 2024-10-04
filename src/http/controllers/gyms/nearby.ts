import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { latitudeLongitudeValidation } from '@/utils/zod/validate-latitude-longitude'
import type { FastifyReply, FastifyRequest } from 'fastify'

const nearbyGymQuerySchema = latitudeLongitudeValidation

export async function nearbyGym(request: FastifyRequest, reply: FastifyReply) {
  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.query)

  const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase()
  const { gyms } = await fetchNearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}

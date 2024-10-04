import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { latitudeLongitudeValidation } from '@/utils/zod/validate-latitude-longitude'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createGymBodySchema = z
  .object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
  })
  .and(latitudeLongitudeValidation)

export async function createGym(request: FastifyRequest, reply: FastifyReply) {
  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}

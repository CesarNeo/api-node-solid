import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const searchGymQuerySchema = z.object({
  query: z.string(),
  page: z.coerce.number().min(1).default(1),
})

export async function searchGym(request: FastifyRequest, reply: FastifyReply) {
  const { query, page } = searchGymQuerySchema.parse(request.query)

  const searchGymUseCase = makeSearchGymsUseCase()
  const { gyms } = await searchGymUseCase.execute({ query, page })

  return reply.status(200).send({ gyms })
}

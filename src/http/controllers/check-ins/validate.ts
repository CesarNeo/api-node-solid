import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const validateCheckInParamsSchema = z.object({
  checkInId: z.string().uuid(),
})

export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()
  await validateCheckInUseCase.execute({ checkInId })

  return reply.status(204).send()
}

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUserUseCase = makeRegisterUserUseCase()

    await registerUserUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}

import '@fastify/jwt'
import type { RoleEnum } from '@prisma/client'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
      role: RoleEnum
    }
  }
}

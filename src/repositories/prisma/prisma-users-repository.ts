import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import type { IUsersRepository } from '../users-repository'

export class PrismaUsersRepository implements IUsersRepository {
  async findByEmail(email: string) {
    const result = await prisma.user.findUnique({ where: { email } })

    return result
  }

  async create(data: Prisma.UserCreateInput) {
    const result = await prisma.user.create({ data })

    return result
  }
}

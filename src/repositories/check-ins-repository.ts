import type { CheckIn, Prisma } from '@prisma/client'

export interface ICheckInsRepository {
  findManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>
  findByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>
}

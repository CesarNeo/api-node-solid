import type { Gym, Prisma } from '@prisma/client'

export interface IGymsRepository {
  searchMany: (query: string, page: number) => Promise<Gym[]>
  findById: (id: string) => Promise<Gym | null>
  create: (data: Prisma.GymCreateInput) => Promise<Gym>
}

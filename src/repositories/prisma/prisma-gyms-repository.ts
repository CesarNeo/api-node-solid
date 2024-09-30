import type { Gym, Prisma } from '@prisma/client'
import type { IFindManyNearbyParams, IGymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'
import { DEFAULT_PAGE_SIZE } from '@/constants/default'

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({ where: { id } })
    return gym
  }

  async findManyNearby({ latitude, longitude }: IFindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: DEFAULT_PAGE_SIZE,
      skip: (page - 1) * DEFAULT_PAGE_SIZE,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data })
    return gym
  }
}

import { Gym, Prisma } from '@prisma/client'
import type { IGymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { DEFAULT_PAGE_SIZE } from '@/constants/default'

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = []

  async searchMany(query: string, page: number) {
    const gyms = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)

    return gyms
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }
}

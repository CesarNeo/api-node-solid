import type { Gym, Prisma } from '@prisma/client'
import type { IGymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import type { Decimal } from '@prisma/client/runtime/library'

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = []

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: data.latitude as Decimal,
      longitude: data.longitude as Decimal,
    }

    this.gyms.push(gym)

    return gym
  }
}

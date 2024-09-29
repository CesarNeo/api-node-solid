import type { Prisma, CheckIn } from '@prisma/client'
import type { ICheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'crypto'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkIn: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkIn.push(checkIn)

    return checkIn
  }
}

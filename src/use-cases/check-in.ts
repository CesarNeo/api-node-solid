import type { CheckIn } from '@prisma/client'
import type { ICheckInsRepository } from '@/repositories/check-ins-repository'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
}
interface ICheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}

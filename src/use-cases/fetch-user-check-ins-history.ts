import type { CheckIn } from '@prisma/client'
import type { ICheckInsRepository } from '@/repositories/check-ins-repository'

interface IFetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}
interface IFetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
    page,
  }: IFetchUserCheckInsHistoryUseCaseRequest): Promise<IFetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}

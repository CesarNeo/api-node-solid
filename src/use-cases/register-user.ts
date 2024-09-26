import type { IUsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import type { User } from '@prisma/client'
import { hash } from 'bcryptjs'

interface IRegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

interface IRegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterUserUseCaseRequest): Promise<IRegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const passwordHash = await hash(password, 6)
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return { user }
  }
}

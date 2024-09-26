import { describe, expect, it } from 'vitest'
import { RegisterUserUseCase } from './register-user'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('Register User Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUserUseCase(usersRepository)

    const { user } = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUserUseCase(usersRepository)

    const { user } = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUserUseCase(usersRepository)

    const email = 'johndoe@example.com'

    await registerUserUseCase.execute({
      name: 'John Doe',
      email,
      password: 'password',
    })

    expect(() =>
      registerUserUseCase.execute({
        name: 'John Doe',
        email,
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})

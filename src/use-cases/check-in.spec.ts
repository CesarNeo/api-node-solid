import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository'
import { CheckInUseCase } from './check-in'
import type { IGymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: IGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const gym = await gymsRepository.create({
      title: 'Gym',
      latitude: new Decimal(-23.5030746),
      longitude: new Decimal(-46.6831925),
    })

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userLatitude: -23.5030746,
      userLongitude: -46.6831925,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const gym = await gymsRepository.create({
      title: 'Gym',
      latitude: new Decimal(-23.5030746),
      longitude: new Decimal(-46.6831925),
    })

    await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userLatitude: -23.5030746,
      userLongitude: -46.6831925,
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-id',
        userLatitude: -23.5030746,
        userLongitude: -46.6831925,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const gym = await gymsRepository.create({
      title: 'Gym',
      latitude: new Decimal(-23.5030746),
      longitude: new Decimal(-46.6831925),
    })

    await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userLatitude: -23.5030746,
      userLongitude: -46.6831925,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-id',
      userLatitude: -23.5030746,
      userLongitude: -46.6831925,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    const gym = await gymsRepository.create({
      title: 'Gym',
      latitude: new Decimal(-23.5030746),
      longitude: new Decimal(-46.6831925),
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})

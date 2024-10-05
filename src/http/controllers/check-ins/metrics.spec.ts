import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Academia do Zé',
        description: 'Academia do Zé',
        phone: '123456789',
        latitude: -23.123456,
        longitude: -46.123456,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        { user_id: user.id, gym_id: gym.id },
        { user_id: user.id, gym_id: gym.id },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})

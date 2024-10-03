import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  setup: async () => {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy')

    return {
      teardown: async () => {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
      },
    }
  },
}

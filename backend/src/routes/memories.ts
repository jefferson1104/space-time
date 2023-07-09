import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  // verify jwt for all routes
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  // request to list memories by userId to logged user
  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  // request to list a memorie by memoryId to logged user.
  app.get('/memories/:id', async (request, reply) => {
    // validation with zod
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    // request param with the zod validation
    const { id } = paramsSchema.parse(request.params)

    // request memory via id on database with error handling
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    // check if the memory belongs to the logged in user and the memory is not public
    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    //  return memory
    return memory
  })

  // request to create a memory by userId to logged user
  app.post('/memories', async (request) => {
    // validate body request with zod
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    // payload with zod validation
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    // save data on database
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    })

    // return data created and saved on database
    return memory
  })

  // request to update a memory by memoryId to logged user
  app.put('/memories/:id', async (request, reply) => {
    // validate request params with zod
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    // request param with the zod validation
    const { id } = paramsSchema.parse(request.params)

    // validate body request with zod
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    // payload with zod validation
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    // find the memory
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    // check if the memory belongs to the logged in user
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    // update data on database
    const memoryUpdated = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    // return memory updated
    return memoryUpdated
  })

  // request to delete a memory by memoryId to logged user
  app.delete('/memories/:id', async (request, reply) => {
    // validate request params with zod
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    // request param with the zod validation
    const { id } = paramsSchema.parse(request.params)

    // find the memory
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    // check if the memory belongs to the logged in user
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    // delete specific memory via id
    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}

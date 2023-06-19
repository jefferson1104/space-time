import { FastifyInstance } from "fastify";
import { z } from 'zod'

import { prisma } from "../lib/prisma";

export async function memoriesRoutes(app: FastifyInstance) {
    app.get('/memories', async () => {
        const memories  = await prisma.memory.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        })

        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat('...'),
            }
        })
    })

    app.get('/memories/:id', async (request) => {
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

        //  return memory
        return memory
    })

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
                userId: 'c227cac7-f972-4ebc-b30a-61b1695057ef'
            },
        })

        // return data created and saved on database
        return memory
    })

    app.put('/memories/:id', async (request) => {
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

    app.delete('/memories/:id', async (request) => {
        // validate request params with zod
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        // request param with the zod validation
        const { id } = paramsSchema.parse(request.params)

        // delete specific memory via id
        await prisma.memory.delete({
            where: {
                id,
            },
        })
    })
}

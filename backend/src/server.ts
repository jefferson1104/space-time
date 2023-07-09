import 'dotenv/config'
import { resolve } from 'node:path'
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'

import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(multipart)

// use this to serve static files from backend
app.register(fastifyStatic, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

// if you want change the API to open for all, put the value 'origin: true'
app.register(cors, {
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
})

app.register(jwt, {
  secret: 'spacetime_soaresdev',
})

app.register(authRoutes)
app.register(memoriesRoutes)
app.register(uploadRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })

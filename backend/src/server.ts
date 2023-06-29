import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

// if you want change the API to open for all, put the value 'origin: true'
app.register(cors, {
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
})

app.register(jwt, {
  secret: 'spacetime_soaresdev',
})

app.register(authRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })

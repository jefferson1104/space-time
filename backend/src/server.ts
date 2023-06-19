import fastify from 'fastify'
import cors from '@fastify/cors'

import { memoriesRoutes } from './routes/memories'

const app = fastify()

// if you want change the API to open for all, put the value 'origin: true'
app.register(cors, {
  origin: ['http://localhost:3000', 'https://yourdomain.com']
})

app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })

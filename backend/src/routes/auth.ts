import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', async (request) => {
        // Zod validation to body request
        const bodySchema = z.object({
            code: z.string()
        })

        // body request validated by zod
        const { code } = bodySchema.parse(request.body)

        // request to get access token by github
        const accessTokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            null,
            {
                params: {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                },
                headers: {
                    Accept: 'application/json'
                },
            },
        )

        // access token by github
        const { access_token } = accessTokenResponse.data

        // request to get user data by access token on github
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
            Authorization: `Bearer ${access_token}`,
            }
        })

        // Zod validation to user data
        const userSchema = z.object({
            id: z.number(),
            login: z.string(),
            name: z.string(),
            avatar_url: z.string().url(),
        })

        // user data validated by zod
        const userInfo = userSchema.parse(userResponse.data)

        // Check if the user exists in the database
        let user = await prisma.user.findUnique({
            where: {
                githubId: userInfo.id,
            }
        })

        // If the user does not exist in the database, create it
        if (!user) {
            user = await prisma.user.create({
                data: {
                    githubId: userInfo.id,
                    login: userInfo.login,
                    name: userInfo.name,
                    avatarUrl: userInfo.avatar_url,
                }
            })
        }

        // Create a JWT
        const token = app.jwt.sign({
            name: user.name,
            userUrl: user.avatarUrl,
        }, {
            sub: user.id,
            expiresIn: '30 days',
        })

        // return JWT
        return {
            token,
        }
    })
}

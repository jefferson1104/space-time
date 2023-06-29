import { cookies } from 'next/headers'
import decode from 'jwt-decode'

interface User {
    sub: string
    name: string
    avatarUrl: string
}

export function getUser(): User {
    const token = cookies().get('_spacetime_token')?.value

    if (!token) {
        throw new Error('Missing token')
    }

    const user: User = decode(token)

    return user
}

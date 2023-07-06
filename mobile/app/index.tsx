import { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'

// IMAGES
import Logo from '../src/assets/spacetime-logo.svg'

// UTILS
import { api } from '../src/lib/api'

// APP UTILS
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/83afc4d76a4936e75dc6',
}

// APP
export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '83afc4d76a4936e75dc6',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    try {
      const response = await api.post('/register', { code })

      const { token } = response.data

      await SecureStore.setItemAsync('_spacetime_token', token)

      router.push('/memories')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <Logo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase leading-none text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 por Soares Dev LTDA.
      </Text>
    </View>
  )
}

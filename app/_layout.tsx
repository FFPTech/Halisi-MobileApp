import { init } from '@emailjs/react-native'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { Userprovider } from '../context/UserContext'
import { store } from '../store/store'

export default function RootLayout() {
  init({ publicKey: 'iaVah_L30iq6IQXoc' })
  return (
    <Provider store={store}>
      <Userprovider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SafeAreaProvider>
      </Userprovider>
    </Provider>
  )
}

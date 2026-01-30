/* eslint-disable react-hooks/rules-of-hooks */
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppModal } from '../components/AppModal'
import LoadingSpinner from '../components/LoadingSpinner'

import { useDispatch, useSelector } from 'react-redux'
import { removeSignInModal, signInWithGoogle } from '../features/userSlice'
import type { AppDispatch } from '../store/store'

export default function index() {
  // const {
  //   handleSignIn,
  //   loading,
  //   signInModal,
  //   setSignInModal,
  // } = useUser()

  const dispatch = useDispatch<AppDispatch>()

  const { loading, signInModal, agent } = useSelector(
    (state: any) => state.user,
  )
  // const [signInModal, setSignInModal] = React.useState(false)

  const router = useRouter()

  const handleResponseNo = () => {
    dispatch(removeSignInModal())
    router.replace('/')
  }

  const handleResponseYes = () => {
    dispatch(removeSignInModal())
    if (agent.role === 'veterinarian') {
      router.replace('/VetLicenseNumberVerification')
    } else if (agent.role === 'field_officer') {
      router.replace('/FillForm')
    }
    // router.replace('/FillForm')
  }

  const handleLoginClick = async () => {
    // ✅ Dispatch the thunk
    const result = await dispatch(signInWithGoogle())
    if (signInWithGoogle.rejected.match(result)) {
      Alert.alert('Login Failed', result.payload || 'Something went wrong')
    } else {
      Alert.alert('Welcome!', `Hello ${result.payload?.agent.name}`)
    }
  }

  // const clearAllData = async () => {
  // try {
  //   await AsyncStorage.clear();
  //   console.log("All local data cleared successfully!");
  // } catch (error) {
  //   console.error(" Error clearing AsyncStorage:", error);
  // }}
  //  Load or initialize users
  //  Handle Login
  if (loading) {
    return <LoadingSpinner size='large' color=' #2e7d32' />
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar backgroundColor='#2e7d32' />

      <View style={styles.container}>
        <Image
          source={require('../assets/images/halisi-logo.png')}
          style={styles.logo}
          resizeMode='contain'
        />

        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          style={{ width: 212, height: 48 }}
          onPress={handleLoginClick}
        />
      </View>
      <AppModal visible={signInModal}>
        <View>
          <Text>
            Welcome! You are authenticated and ready to go. Feel free to
            proceed.
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleResponseYes}>
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResponseNo}>
              <Text>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  )
}

//Emulator SHA-1 fingerprint:
//5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

//Physical Device SHA-1 fingerprint:
// 87:C9:44:73:0F:0D:5E:B5:BC:E6:72:CD:24:C6:B5:07:C1:D2:ED:5F
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#eee',
  },
  container: {
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
})

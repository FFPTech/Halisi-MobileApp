import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { useUser } from '../Hooks/useUserGlobal'
import { setCloseGotoRegistration } from '../features/farmerSlice'

export const RegisterAnotherLivestockScreen = () => {
  const dispatch = useDispatch()

  const { step, setStep, setShowTagName, setRatings } = useUser()
  const handleRegisterAnotherLivestock = () => {
    setStep(3)
    router.replace('/(tabs)/FarmerForm')
    // dispatch(setCloseRegisterNewLivestock(false))
    dispatch(setCloseGotoRegistration(false))

    console.log('button clicked', step)

    setShowTagName(true)
  }

  const handleDonotRegisterLivestock = () => {
    // setRegisterNewLivestock(false)
    setRatings(true)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Would you like to register another livestock?
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.yesButton}
          onPress={handleRegisterAnotherLivestock}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.noButton}
          onPress={handleDonotRegisterLivestock}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RegisterAnotherLivestockScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  yesButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  noButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})

import { router } from 'expo-router'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import { AppModal } from '../components/AppModal'
import CommonButton from '../components/CommonButtonComponent'
import Dropdown from '../components/DropDown'
import InputField from '../components/InputComponent'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'

export default function VetLicenseNumberVerification() {
  const { agent } = useSelector((state: any) => state.user)
  const [selectCountry, setSelctedCountry] = useState<string>()
  const [vetLicenseNumber, setVetLicenseNumber] = useState('')
  const [loadingVerifyVet, setLoadingVerifyVet] = useState(false)
  const [openModal, setShowOpenModal] = useState(false)
  const [openModalError, setShowOpenModalError] = useState(false)

  if (loadingVerifyVet) {
    return <LoadingSpinner />
  }

  const handleVerificaton = () => {
    setLoadingVerifyVet(true)

    if (agent.registration_number === vetLicenseNumber) {
      setLoadingVerifyVet(false)
      setShowOpenModal(true)
    } else {
      setLoadingVerifyVet(false)
      setShowOpenModalError(true)
    }
  }

  return (
    <View style={styles.container}>
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Keyboard-aware wrapper */}
      <KeyboardAvoidingView
        style={styles.centerWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps='handled'
        >
          <Text style={styles.title}>Enter Veterinarian License Number</Text>

          <View style={styles.form}>
            <Dropdown
              label='Country'
              selectedValue={selectCountry}
              onValueChange={setSelctedCountry}
              options={[
                { label: 'Kenya', value: 'Kenya' },
                {
                  label: 'Democratic Republic of Congo',
                  value: 'Democratic Republic of Congo',
                },
              ]}
            />

            <InputField
              label='Veterinarian License Number'
              value={vetLicenseNumber}
              onChangeText={setVetLicenseNumber}
              placeholder='Enter Farmer NIN'
              error={
                vetLicenseNumber
                  ? vetLicenseNumber.length === 0
                    ? 'Veterinarian License Number is required'
                    : vetLicenseNumber.length > 20
                      ? 'Veterinarian License Number exceeds 20 digits'
                      : undefined
                  : undefined
              }
              numbersOnly
            />

            {/* Submit Button */}
            <View style={styles.buttonWrapper}>
              <CommonButton title='Submit' onPress={handleVerificaton} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppModal visible={openModal}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Veterinarian License Number successfully verified. You can continue.
        </Text>
        <TouchableOpacity onPress={() => router.replace('/FillForm')}>
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Ok</Text>
        </TouchableOpacity>
      </AppModal>
      <AppModal visible={openModalError}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Veterinarian License Number verification not successful. Please
          inspect and retry.
        </Text>
        <TouchableOpacity onPress={() => setShowOpenModalError(false)}>
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Ok</Text>
        </TouchableOpacity>
      </AppModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },

  centerWrapper: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // vertically center the content
    paddingHorizontal: 16,
    paddingBottom: 40, // give space at the bottom for keyboard
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },

  form: {
    width: '100%',
  },

  buttonWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
})

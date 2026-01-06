import Checkbox from 'expo-checkbox'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { setConsent } from '../features/userSlice'
import { useAppDispatch, useAppSelector } from '../Hooks/hook'

export default function FillForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // ✅ Boolean consent
  const agreed = useAppSelector((state) => state.user.consent)

  const handleConsentChange = (value: boolean) => {
    dispatch(setConsent(value))
  }

  const handleContinue = () => {
    if (!agreed) {
      Alert.alert(
        'Consent Required',
        'You must agree to the Terms and Conditions to continue.'
      )
      return
    }

    router.push('/FarmerForm')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Farmers</Text>

      <Text style={styles.text}>
        By continuing, you confirm that you have read and agree to the Terms and
        Conditions and consent to the use of your data for farmer registration.
      </Text>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreed}
          onValueChange={handleConsentChange}
          color={agreed ? '#2e7d32' : undefined}
        />

        <Text style={styles.checkboxLabel}>
          I agree to the{' '}
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL('https://halisi.ai/halisi-livestock-privacy-en')
            }
          >
            Terms and Conditions
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !agreed && styles.buttonDisabled]}
        disabled={!agreed}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e1e1e',
  },
  text: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  link: {
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

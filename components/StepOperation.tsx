import React from 'react'
import { Pressable, Text } from 'react-native'
import { closeOperationScreen } from '../features/farmerSlice'

import { router } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'
import { useUser } from '../Hooks/useUserGlobal'
import FormStepWrapper from './FormStepWrapper'

const StepOperation = ({ nextStep }: { nextStep: () => void }) => {
  const { setStep } = useUser()
  const { agent } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()

  const isVet = agent?.role === 'veterinarian'
  const isFieldOfficer = agent?.role === 'field_officer'

  const handleRegisterLivestock = () => {
    dispatch(closeOperationScreen(false))
    setStep(3)
  }

  const handleUpdateLivestock = () => {
    // your update logic here
    // setStep(4)
    router.replace('/GetAllLivestockScreen')
  }

  return (
    <FormStepWrapper title='Select an Operation to proceed'>
      {/* Register Livestock */}
      <Pressable
        disabled={!isFieldOfficer}
        onPress={handleRegisterLivestock}
        style={{
          marginBottom: 20,
          padding: 15,
          backgroundColor: isFieldOfficer ? '#2e7d32' : '#999',
          borderRadius: 8,
          alignItems: 'center',
          opacity: isFieldOfficer ? 1 : 0.6,
        }}
      >
        <Text
          style={{
            color: isFieldOfficer ? '#fff' : '#000',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          Register Livestock
        </Text>
      </Pressable>

      {/* Update Livestock */}
      <Pressable
        disabled={!isVet}
        onPress={handleUpdateLivestock}
        style={{
          marginBottom: 20,
          padding: 15,
          backgroundColor: isVet ? '#2e7d32' : '#999',
          borderRadius: 8,
          alignItems: 'center',
          opacity: isVet ? 1 : 0.6,
        }}
      >
        <Text
          style={{
            color: isVet ? '#fff' : '#000',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          Update Livestock
        </Text>
      </Pressable>

      {/* Loan Request (disabled for now) */}
      <Pressable
        disabled
        style={{
          marginBottom: 20,
          padding: 15,
          backgroundColor: '#999',
          borderRadius: 8,
          alignItems: 'center',
          opacity: 0.6,
        }}
      >
        <Text
          style={{
            color: '#000',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          Loan Request
        </Text>
      </Pressable>
    </FormStepWrapper>
  )
}

export default StepOperation

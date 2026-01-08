import React from 'react'
import { Pressable, Text } from 'react-native'
import { closeOperationScreen } from '../features/farmerSlice'
import { useAppDispatch } from '../Hooks/hook'
import FormStepWrapper from './FormStepWrapper'

const StepOperation = ({ nextStep }: { nextStep: () => void }) => {
  // const {showTagNameInput,setShowTagName,} = useUser()
  // const [showCameraComponent, SetShowCameraComponent] =useState(false)
  const dispatch = useAppDispatch()
  const handleRegisterLivetock = () => {
    dispatch(closeOperationScreen(false))
    nextStep()
  }
  return (
    <>
      <FormStepWrapper title='Select an Operation to proceed'>
        <Pressable
          style={{
            marginBottom: 20,
            padding: 15,
            backgroundColor: '#2e7d32',
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={() => handleRegisterLivetock()}
        >
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            Register Livestock
          </Text>
        </Pressable>
        <Pressable
          style={{
            marginBottom: 20,
            padding: 15,
            backgroundColor: '#999',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#000',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            Update Livestock
          </Text>
        </Pressable>
        <Pressable
          style={{
            marginBottom: 20,
            padding: 15,
            backgroundColor: '#999',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#000',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            Loan Livestock
          </Text>
        </Pressable>
      </FormStepWrapper>
    </>
  )
}

export default StepOperation

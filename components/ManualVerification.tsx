import { router } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setShowGoToRegistration } from '../features/farmerSlice'
import { useUser } from '../Hooks/useUserGlobal'
import FormStepWrapper from './FormStepWrapper'

export default function ManualVerification() {
  const { livestockResponseData } = useSelector((state: any) => state.farmer)
  const dispatch = useDispatch()
  const { setStep } = useUser()
  const base64Header = 'data:image/jpeg;base64,'

  if (
    !livestockResponseData?.original_image ||
    !livestockResponseData?.face_image
  ) {
    return (
      <FormStepWrapper title='Manual Verification'>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Loading images...</Text>
        </View>
      </FormStepWrapper>
    )
  }

  const handleSameIdentities = () => {
    setStep(4)
    router.replace('/FarmerForm')
  }

  const handleDifferentIdentities = () => {
    setStep(3)
    dispatch(setShowGoToRegistration(false))
    router.replace('/FarmerForm')
  }

  return (
    <FormStepWrapper title='Manual Verification'>
      <View style={{ flex: 1, marginTop: 20, gap: 20 }}>
        <Image
          source={{ uri: base64Header + livestockResponseData.original_image }}
          style={{
            width: '100%',
            height: 260,
            borderRadius: 16,
            resizeMode: 'cover',
            borderWidth: 1,
            borderColor: '#ddd',
          }}
        />
        <Image
          source={{ uri: base64Header + livestockResponseData.face_image }}
          style={{
            width: '100%',
            height: 260,
            borderRadius: 16,
            resizeMode: 'cover',
            borderWidth: 1,
            borderColor: '#ddd',
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={handleDifferentIdentities}
          style={{ backgroundColor: '#4CAF50', padding: 4, marginTop: 12 }}
        >
          <Text style={{ color: '#fff' }}>Different identities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSameIdentities}
          style={{ backgroundColor: '#4CAF50', padding: 4, marginTop: 12 }}
        >
          <Text style={{ color: '#fff' }}>Same identities</Text>
        </TouchableOpacity>
      </View>
    </FormStepWrapper>
  )
}

import { router } from 'expo-router'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import FormStepWrapper from '../components/FormStepWrapper'
import { setShowGoToRegistration } from '../features/farmerSlice'
import { useUser } from '../Hooks/useUserGlobal'

export default function ManualVerification() {
  const { livestockResponseData, livestockDBData } = useSelector(
    (state: any) => state.farmer,
  )
  const dispatch = useDispatch()
  const { setStep } = useUser()
  const base64Header = 'data:image/jpeg;base64,'

  if (
    !livestockDBData?.db_data[0]?.face_image ||
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
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, marginTop: 20, gap: 20 }}>
          <Image
            source={{
              uri: base64Header + livestockDBData?.db_data[0]?.face_image,
            }}
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleDifferentIdentities}
              style={{ backgroundColor: '#4CAF50', padding: 8, marginTop: 12 }}
            >
              <Text style={{ color: '#fff' }}>Different identities</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSameIdentities}
              style={{ backgroundColor: '#4CAF50', padding: 8, marginTop: 12 }}
            >
              <Text style={{ color: '#fff' }}>Same identities</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </FormStepWrapper>
  )
}

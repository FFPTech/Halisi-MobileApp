import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import {
  queryLivestockDB,
  setCloseLivestockModal,
  setShowGoToRegistration,
} from '../features/farmerSlice'
import { useAppDispatch } from '../Hooks/hook'
import { AppModal } from './AppModal'
import CommonButton from './CommonButtonComponent'
import FormStepWrapper from './FormStepWrapper'
import InputField from './InputComponent'
import StepCamera from './StepCamera'

const StepLivestock = ({
  nextStep,
  livestocktag,
  setLivestockTag,
  errors,
  permission,
  requestPermission,
  livestockPhotoUri,
  setLivestockPhotoUri,
  cameraRef,
  facing,
  toggleCameraFacing,
  setPhotoBase64,
  handleSubmitLivestock,
}: {
  livestocktag: string
  setLivestockTag: (val: string) => void
  errors?: { livestocktag?; livestockPhotoUri? }
  requestPermission: () => void
  livestockPhotoUri: string
  facing
  toggleCameraFacing: () => void
  showVerifyScreen?: boolean
  setPhotoBase64
  setLivestockPhotoUri
  cameraRef
  permission
  nextStep: () => void
  handleSubmitLivestock
}) => {
  const dispatch = useAppDispatch()

  const agent = useSelector((state: any) => state.user.agent)

  // const [showCameraComponent, SetShowCameraComponent] = useState(false)
  const { livestockMessage, showGoToRegistration, livestockTagModal } =
    useSelector((state: any) => state.farmer)

  const [errorMessage, setErrorMessage] = React.useState('')

  const handleFormSubmit = () => {
    if (!livestocktag) {
      setErrorMessage('Please enter a livestock tag number')
      return
    }
    dispatch(queryLivestockDB({ livestockTagNumber: livestocktag, agent }))
  }

  const handleCloseModal = () => {
    dispatch(setShowGoToRegistration(true))
    dispatch(setCloseLivestockModal(false))
  }

  return (
    <>
      {showGoToRegistration ? (
        <StepCamera
          permission={permission}
          requestPermission={requestPermission}
          photoUri={livestockPhotoUri}
          setPhotoUri={setLivestockPhotoUri}
          cameraRef={cameraRef}
          facing={facing}
          toggleCameraFacing={toggleCameraFacing}
          setPhotoBase64={setPhotoBase64}
          species='livestock'
          errors={errors.livestockPhotoUri}
          onpress={handleSubmitLivestock}
        />
      ) : (
        <FormStepWrapper title={'Livestock Authentication'}>
          <InputField
            onChangeText={setLivestockTag}
            error={errorMessage}
            value={livestocktag}
            label='Livestock Tag Number'
            placeholder='Enter Tag Number'
          />
          <View
            style={{
              marginTop: 30,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CommonButton onPress={handleFormSubmit} title='Submit' />
          </View>
          <AppModal visible={livestockTagModal}>
            <Text style={{ textAlign: 'center' }}>{livestockMessage}</Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>Ok</Text>
            </TouchableOpacity>
          </AppModal>
        </FormStepWrapper>
      )}
    </>
  )
}

//next step
//after submitting livestock details
//open camera component to capture livestock photo
//display captured photo and submit button
//on submit send data to api
//handle response and errors
//display modal to register another livestock or finish process

export default StepLivestock

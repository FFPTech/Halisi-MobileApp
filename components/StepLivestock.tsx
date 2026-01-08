import React, { useState } from 'react'
import { View } from 'react-native'
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
  setPhotoBase64
  setLivestockPhotoUri
  cameraRef
  permission
  nextStep: () => void
  handleSubmitLivestock
}) => {
  const [showCameraComponent, SetShowCameraComponent] = useState(false)

  return (
    <>
      {showCameraComponent ? (
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
            error={errors.livestocktag}
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
            <CommonButton
              onPress={() => SetShowCameraComponent(true)}
              title='Submit'
            />
          </View>
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

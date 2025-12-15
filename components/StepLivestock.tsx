import React, { useState } from 'react'
import { View } from 'react-native'
import CommonButton from './CommonButtonComponent'
import FormStepWrapper from './FormStepWrapper'
import InputField from './InputComponent'
import StepCamera from './StepCamera'
StepCamera

const StepLivestock = ({nextStep,livestocktag,setLivestockTag,errors,permission,
  requestPermission,
  livestockPhotoUri,
  setLivestockPhotoUri,
  cameraRef,
  facing,
  toggleCameraFacing,
  setPhotoBase64,
  
  }:{livestocktag:string, setLivestockTag:(val:string)=>void,errors?:{livestocktag?,livestockPhotoUri?},requestPermission:()=>void,livestockPhotoUri:string,facing,toggleCameraFacing:()=>void,setPhotoBase64,setLivestockPhotoUri,cameraRef,permission,nextStep:()=>void}) => {
  const [showCameraComponent, SetShowCameraComponent] =useState(false)
  
  return (
    <>{
      showCameraComponent ? 
      <StepCamera
                permission={permission}
                requestPermission={requestPermission}
                photoUri={livestockPhotoUri}
                setPhotoUri={setLivestockPhotoUri}
                cameraRef={cameraRef}
                facing={facing}
                toggleCameraFacing={toggleCameraFacing}
                setPhotoBase64={setPhotoBase64}
                species="livestock"
                errors={errors.livestockPhotoUri} />      : <FormStepWrapper title={"Livestock Authentication"}>
      
        <InputField onChangeText={setLivestockTag} error={errors.livestocktag} value={livestocktag}  label="Livestock Tag Number" placeholder="Enter Tag Number" />  
        <View style={{marginTop:30,flex:1, justifyContent:"center",alignItems:"center"}} >
        
              <CommonButton onPress={()=>SetShowCameraComponent(true)} title="Submit"/>
              </View>
    </FormStepWrapper>
    }
   
    </>
  )
}

export default StepLivestock
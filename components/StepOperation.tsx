import React, { useState } from 'react'
import { Pressable, Text } from 'react-native'
import { useUser } from '../Hooks/useUserGlobal'
import FormStepWrapper from './FormStepWrapper'
import StepLivestock from './StepLivestock'


const StepOperation = ({nextStep,livestocktag,setLivestockTag,errors, permission,
  requestPermission,
  livestockPhotoUri,
  setLivestockPhotoUri,
  cameraRef,
  facing,
  toggleCameraFacing,
  setPhotoBase64s,
  handleSubmitLivestock
  }:{livestocktag:string,setLivestockTag:(val:string)=>void,errors?:{},requestPermission:()=>void,livestockPhotoUri:string,facing:string,toggleCameraFacing:()=>void,setPhotoBase64s,setLivestockPhotoUri:(val:string | null)=>void,cameraRef,permission:any,nextStep:()=>void,handleSubmitLivestock:()=>void}) => {
  const {showTagNameInput,setShowTagName} = useUser()
  const [showCameraComponent, SetShowCameraComponent] =useState(false)
  
  return (
    <>
    {showTagNameInput?<StepLivestock
    nextStep={nextStep}
              livestocktag={livestocktag}
              setLivestockTag={setLivestockTag}
              errors={errors}
              permission={permission}
          requestPermission={requestPermission}
          livestockPhotoUri={livestockPhotoUri}
          setLivestockPhotoUri={setLivestockPhotoUri}
          cameraRef={cameraRef}
          facing={facing}
          toggleCameraFacing={toggleCameraFacing}
          setPhotoBase64={setPhotoBase64s}
          handleSubmitLivestock={handleSubmitLivestock}
        />
                   
         
              :
    <FormStepWrapper title="Select an Operation to proceed">
      <Pressable style={{ marginBottom: 20, padding: 15, backgroundColor: "#2e7d32", borderRadius: 8, alignItems: "center" } } onPress={()=>{setShowTagName(true)}}>
        <Text style={{ color: "#fff" ,textTransform:"uppercase", fontWeight:'bold'}}>Register Livestock</Text>
      </Pressable>
      <Pressable style={{ marginBottom: 20, padding: 15, backgroundColor: "#999", borderRadius: 8, alignItems: "center" }}>
        <Text style={{ color: "#000" ,textTransform:"uppercase", fontWeight:'bold'}}>Update Livestock</Text>
      </Pressable>
      <Pressable style={{ marginBottom: 20, padding: 15, backgroundColor: "#999", borderRadius: 8, alignItems: "center" }}>
        <Text style={{ color: "#000" ,textTransform:"uppercase", fontWeight:'bold'}}>Loan Livestock</Text>
      </Pressable>
    </FormStepWrapper>
        }
    </>
  )
}

export default StepOperation
import React, { useState } from 'react'
import { Pressable, Text } from 'react-native'
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
 
  }:{livestocktag:string,setLivestockTag:(val:string)=>void,errors?:{},requestPermission:()=>void,livestockPhotoUri:string,facing:string,toggleCameraFacing:()=>void,setPhotoBase64s,setLivestockPhotoUri:(val:string | null)=>void,cameraRef,permission:any,nextStep:()=>void}) => {
  const [showTagNameInput,SetShowTagName] = useState(false)
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
        />
                   
         
              :
    <FormStepWrapper title="Select an Operation to proceed">
      <Pressable style={{ marginBottom: 20, padding: 15, backgroundColor: "#2e7d32", borderRadius: 8, alignItems: "center" } } onPress={()=>{SetShowTagName(true)}}>
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
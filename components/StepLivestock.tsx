import React from 'react'
import FormStepWrapper from './FormStepWrapper'
import InputField from './InputComponent'


const StepLivestock = ({livestocktag,setLivestockTag,errors}:{livestocktag:string, setLivestockTag:(val:string)=>void,errors?:{livestocktag?}}) => {
  return (
    <FormStepWrapper title={"Livestock Authentication"}>
      
        <InputField onChangeText={setLivestockTag} error={errors.livestocktag} value={livestocktag}  label="Livestock Tag Number" placeholder="Enter Tag Number" />  
    </FormStepWrapper>
  )
}

export default StepLivestock
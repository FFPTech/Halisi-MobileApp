import React from 'react'
import { Pressable, Text } from 'react-native'
import FormStepWrapper from './FormStepWrapper'


const StepOperation = ({nextStep}:{nextStep:()=>void}) => {
  return (
    <FormStepWrapper title="Select an Operation to proceed">
      <Pressable style={{ marginBottom: 20, padding: 15, backgroundColor: "#2e7d32", borderRadius: 8, alignItems: "center" } } onPress={nextStep}>
        <Text style={{ color: "#fff" ,textTransform:"uppercase", fontWeight:'bold'}}>Register Livestock</Text>
      </Pressable>
      <Pressable style={{ marginBottom: 20, padding: 15, backgroundColor: "#999", borderRadius: 8, alignItems: "center" }}>
        <Text style={{ color: "#000" ,textTransform:"uppercase", fontWeight:'bold'}}>Update Livestock</Text>
      </Pressable>
      <Pressable style={{ marginBottom: 20, padding: 15, backgroundColor: "#999", borderRadius: 8, alignItems: "center" }}>
        <Text style={{ color: "#000" ,textTransform:"uppercase", fontWeight:'bold'}}>Loan Livestock</Text>
      </Pressable>
    </FormStepWrapper>
  )
}

export default StepOperation
// components/steps/StepNationalId.tsx
import { useState } from "react";
import { Text, View } from "react-native";
import CommonButton from "./CommonButtonComponent";
import Dropdown from "./DropDown";
import FormStepWrapper from "./FormStepWrapper";
import InputField from "./InputComponent";
import StepCamera from "./StepCamera";
import ToggleButton from "./ToggleComponent";

interface StepNationalIdProps {
  isEnabled: boolean;
  setIsEnabled: (val: boolean) => void;
  nationalId: string;
  setNationalId: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
permission: { granted: boolean };
  requestPermission: () => void;
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  cameraRef: React.RefObject<any>;
  facing: "front" | "back";
  toggleCameraFacing: () => void;
  setPhotoBase64: (base64: string | null) => void;
  species: "farmer" | "livestock";
  errors?: {
    nationalId?: string;
    country?: string;
    photoUri?: string;
  };
}

export default function StepNationalId({
  isEnabled,
  setIsEnabled,
  nationalId,
  setNationalId,
  country,
  setCountry,
   permission,
  requestPermission,
  photoUri,
  setPhotoUri,
  cameraRef,
  facing,
  toggleCameraFacing,
  setPhotoBase64,
  species,
  errors = {}
}: StepNationalIdProps) {
  const [showcameraComponent, setShowCameraComponent] = useState(false);
  return (
    <>{
      !showcameraComponent ? <FormStepWrapper title="Step 1: Farmer National Identification Number">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
        <Text style={{ width: 230, textAlign: "center" }}>
          Use Population Registration System Verification
        </Text>
        <ToggleButton value={isEnabled} onChange={setIsEnabled} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Dropdown
          label="Country"
          selectedValue={country}
          onValueChange={setCountry}
          options={[
            { label: "Kenya", value: "Kenya" },
            { label: "Congo", value: "Congo" }
          ]}
          // <-- show error under dropdown
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <InputField
          label="Farmer NIN"
          value={nationalId}
          onChangeText={setNationalId}
          placeholder="Enter Farmer NIN"
          error={errors.nationalId} // <-- show error under input
        />
      </View>
      <View style={{marginTop:30}} >

      <CommonButton onPress={()=>setShowCameraComponent(true)} title="Submit"/>
      </View>
    </FormStepWrapper> :<StepCamera
      permission={permission}
      requestPermission={requestPermission}
      photoUri={photoUri}
      setPhotoUri={setPhotoUri}
      cameraRef={cameraRef}
      facing={facing}
      toggleCameraFacing={toggleCameraFacing}
      setPhotoBase64={setPhotoBase64}
      species={species}
      errors={errors}      // <-- REQUIRED
    />
    }
    

   
    </>
  );
}

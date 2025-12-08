// components/steps/StepNationalId.tsx
import { Text, View } from "react-native";
import Dropdown from "./DropDown";
import FormStepWrapper from "./FormStepWrapper";
import InputField from "./InputComponent";
import ToggleButton from "./ToggleComponent";

interface StepNationalIdProps {
  isEnabled: boolean;
  setIsEnabled: (val: boolean) => void;
  nationalId: string;
  setNationalId: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  errors?: {
    nationalId?: string;
    country?: string;
  };
}

export default function StepNationalId({
  isEnabled,
  setIsEnabled,
  nationalId,
  setNationalId,
  country,
  setCountry,
  errors = {}
}: StepNationalIdProps) {
  return (
    <FormStepWrapper title="Step 1: Farmer National Identification Number">
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
    </FormStepWrapper>
  );
}

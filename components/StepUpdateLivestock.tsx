import { useState } from 'react'
import { Text, View } from 'react-native'
import CheckboxGroup from './Checkbox'
import DateInput from './DateInputComponent'
import Dropdown from './DropDown'
import FormStepWrapper from './FormStepWrapper'
import InputField from './InputComponent'

const livestockTypes = ['Cattle', 'Sheep', 'Goat', 'Porc']
const livestockOptions = [
  'Milk Production',
  'Breeding Stock',
  'Draft animal (farming activity)',
  'Show and Exhibition',
  'Companionship',
  'Conservation Grazing',
]
const healthStatus = ['Healthy', 'Sick', 'Critical']

function StepUpdateLivestock() {
  // 🔹 Input states
  const [tagNumber, setTagNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [livestockType, setLivestockType] = useState('')
  const [marketValue, setMarketValue] = useState('')
  const [weight, setWeight] = useState('')
  const [breed, setBreed] = useState('')

  // 🔹 Dropdown states
  const [purpose, setPurpose] = useState('')
  const [health, setHealth] = useState('')
  const [gender, setGender] = useState('')
  const [veterinaryCare, setVeterinaryCare] = useState('')
  const [herdSize, setHerdSize] = useState('')
  const [vaccinations, setVaccinations] = useState<string[]>([])

  const vaccinationOptions = [
    'East Coast Fever (ECF)',
    'Rift Valley Fever (RVF)',
    'Foot & Mouth Disease (FMD)',
    'Contagious Bovine Pleuropneumonia (CBP)',
    'Blackleg',
    'Anthrax',
  ].map((item) => ({
    label: item,
    value: item,
  }))

  return (
    <FormStepWrapper title='Livestock information'>
      <View>
        <Text>Fill-in Livestock form</Text>
      </View>

      <View>
        <InputField
          label='Current Tag Number'
          value={tagNumber}
          onChange={(e) => setTagNumber(e.nativeEvent.text)}
        />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <DateInput
          label='Date of Birth'
          value={dateOfBirth}
          onChange={setDateOfBirth}
        />
      </View>

      <View>
        <Dropdown
          label='Livestock Type'
          options={livestockTypes.map((type) => ({
            label: type,
            value: type,
          }))}
          selectedValue={livestockType}
          onValueChange={setLivestockType}
        />
      </View>

      <View>
        <InputField
          label='Estimated Market Value (KSh.)'
          value={marketValue}
          onChange={(e) => setMarketValue(e.nativeEvent.text)}
          numbersOnly
        />
      </View>

      <View>
        <InputField
          label='Livestock Weight (Kgs.)'
          value={weight}
          onChange={(e) => setWeight(e.nativeEvent.text)}
          numbersOnly
        />
      </View>

      <View>
        <InputField
          label='Breed'
          value={breed}
          onChange={(e) => setBreed(e.nativeEvent.text)}
        />
      </View>

      <View>
        <Dropdown
          label='Select Livestock Purpose'
          options={livestockOptions.map((item) => ({
            label: item,
            value: item,
          }))}
          selectedValue={purpose}
          onValueChange={setPurpose}
        />
      </View>

      <View>
        <Dropdown
          label='General Health Status'
          options={healthStatus.map((item) => ({
            label: item,
            value: item,
          }))}
          selectedValue={health}
          onValueChange={setHealth}
        />
      </View>

      <View>
        <Dropdown
          label='Gender'
          options={['Male', 'Female'].map((item) => ({
            label: item,
            value: item,
          }))}
          selectedValue={gender}
          onValueChange={setGender}
        />
      </View>

      <View>
        <Dropdown
          label='Veterinary Care'
          options={[
            'Healthy skin and body',
            'Diseased skin',
            'Body deformities',
          ].map((item) => ({
            label: item,
            value: item,
          }))}
          selectedValue={veterinaryCare}
          onValueChange={setVeterinaryCare}
        />
      </View>

      <View>
        <Dropdown
          label='Herd size'
          options={['Small (1-50)', 'Medium (51-200)', 'Large (201-500)'].map(
            (item) => ({
              label: item,
              value: item,
            }),
          )}
          selectedValue={herdSize}
          onValueChange={setHerdSize}
        />
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
        <CheckboxGroup
          label='Vaccination history (select one or more)'
          options={vaccinationOptions}
          selectedValues={vaccinations}
          onChange={setVaccinations}
        />
      </View>
    </FormStepWrapper>
  )
}

export default StepUpdateLivestock

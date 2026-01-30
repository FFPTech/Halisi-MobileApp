import axios from 'axios'
import { router } from 'expo-router'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { AppModal } from './AppModal'
import CheckboxGroup from './Checkbox'
import CommonButton from './CommonButtonComponent'
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

type FormErrors = {
  [key: string]: string
}

function StepUpdateLivestock() {
  const { agent } = useSelector((state: any) => state.user)
  const { livestockRecordId, livestockOperation, enrollLivestockDbData } =
    useSelector((state: any) => state.farmer)
  // 🔹 Input states
  const [tagNumber, setTagNumber] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [livestockType, setLivestockType] = useState('')
  const [marketValue, setMarketValue] = useState('')
  const [weight, setWeight] = useState('')
  const [breed, setBreed] = useState('')

  const [purpose, setPurpose] = useState('')
  const [health, setHealth] = useState('')
  const [gender, setGender] = useState('')
  const [veterinaryCare, setVeterinaryCare] = useState('')
  const [herdSize, setHerdSize] = useState('')
  const [vaccinations, setVaccinations] = useState<string[]>([])
  const [livestockCondition, setLivestockCondition] = useState('')
  const [numOfCalvings, setNumOfCalvings] = useState('')
  const [productionStage, setProductionStage] = useState('')
  const [farmType, setFarmType] = useState('')

  // 🔹 Production inputs (previously missing)
  const [expectedMonthlyMilk, setExpectedMonthlyMilk] = useState('')
  const [actualMonthlyMilk, setActualMonthlyMilk] = useState('')
  const [expectedMonthlyWeight, setExpectedMonthlyWeight] = useState('')
  const [actualMonthlyWeight, setActualMonthlyWeight] = useState('')

  const [errors, setErrors] = useState<FormErrors>({})
  const [apiInProgress, setApiInProgress] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [verifyNewLivestockModal, setVerifyNewLivestockModal] = useState(false)

  const vaccinationOptions = [
    'East Coast Fever (ECF)',
    'Rift Valley Fever (RVF)',
    'Foot & Mouth Disease (FMD)',
    'Contagious Bovine Pleuropneumonia (CBP)',
    'Blackleg',
    'Anthrax',
  ].map((item) => ({ label: item, value: item }))

  // 🔹 Validation
  const validateForm = () => {
    const newErrors: FormErrors = {}

    const requiredFields = [
      { key: 'tagNumber', label: 'Current Tag Number', value: tagNumber },
      { key: 'dateOfBirth', label: 'Date of Birth', value: dateOfBirth },
      { key: 'livestockType', label: 'Livestock Type', value: livestockType },
      {
        key: 'marketValue',
        label: 'Estimated Market Value',
        value: marketValue,
      },
      { key: 'weight', label: 'Livestock Weight', value: weight },
      { key: 'breed', label: 'Breed', value: breed },
      { key: 'purpose', label: 'Livestock Purpose', value: purpose },
      { key: 'health', label: 'General Health Status', value: health },
      { key: 'gender', label: 'Gender', value: gender },
      {
        key: 'veterinaryCare',
        label: 'Veterinary Care',
        value: veterinaryCare,
      },
      {
        key: 'livestockCondition',
        label: 'Livestock Condition',
        value: livestockCondition,
      },
      {
        key: 'numOfCalvings',
        label: 'Number of Calvings',
        value: numOfCalvings,
      },
      {
        key: 'productionStage',
        label: 'Production Stage',
        value: productionStage,
      },
      { key: 'farmType', label: 'Farm Type', value: farmType },
      { key: 'herdSize', label: 'Herd Size', value: herdSize },

      {
        key: 'expectedMonthlyMilk',
        label: 'Expected Monthly Milk Production',
        value: expectedMonthlyMilk,
      },
      {
        key: 'actualMonthlyMilk',
        label: 'Actual Monthly Milk Production',
        value: actualMonthlyMilk,
      },
      {
        key: 'expectedMonthlyWeight',
        label: 'Expected Monthly Weight Gain',
        value: expectedMonthlyWeight,
      },
      {
        key: 'actualMonthlyWeight',
        label: 'Actual Monthly Weight Gain',
        value: actualMonthlyWeight,
      },

      {
        key: 'vaccinations',
        label: 'Vaccination history',
        value: vaccinations,
        isArray: true,
      },
    ]

    requiredFields.forEach((field) => {
      const isEmpty = field.isArray
        ? !Array.isArray(field.value) || field.value.length === 0
        : !field.value

      if (isEmpty) {
        newErrors[field.key] = `${field.label} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const livestockform = {
    tagNumber,
    dateOfBirth,
    livestockType,
    marketValue,
    weight,
    breed,
    purpose,
    health,
    gender,
    veterinaryCare,
    livestockCondition,
    numOfCalvings,
    productionStage,
    farmType,
    herdSize,
    expectedMonthlyMilk,
    actualMonthlyMilk,
    expectedMonthlyWeight,
    actualMonthlyWeight,
    vaccinations,
  }
  // 🔹 API call
  const updatelivestock = async () => {
    try {
      setApiInProgress(true)

      const data = {
        record: livestockform,
        agent_id: agent.agent_id,
        institution_id: agent.company_id || '',
        record_id: livestockRecordId,
        env: 'Qua',
        operation: livestockOperation,
        uuid: enrollLivestockDbData.identifier,
      }

      const response = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/updatelivestock',
        data,
      )

      if (!response.data?.success) {
        throw new Error('API failed')
      }
      setSuccessModal(true)
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setApiInProgress(false)
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    updatelivestock()
  }

  const handleAction = () => {
    setSuccessModal(false)
    setVerifyNewLivestockModal(true)
  }
  const handleActionYes = () => {
    setVerifyNewLivestockModal(false)
    router.replace('/(tabs)/GetAllLivestockScreen')
  }

  const handleActionNo = () => {
    setVerifyNewLivestockModal(false)
    router.replace('/Ratings')
  }

  return (
    <FormStepWrapper title='Livestock information'>
      <Text>Fill-in Livestock form</Text>

      <InputField
        label='Current Tag Number'
        value={tagNumber}
        onChange={(e) => setTagNumber(e.nativeEvent.text)}
        error={errors.tagNumber}
      />

      <DateInput
        label='Date of Birth'
        value={dateOfBirth}
        onChange={setDateOfBirth}
        error={errors.dateOfBirth}
      />

      <Dropdown
        label='Livestock Type'
        options={livestockTypes.map((v) => ({ label: v, value: v }))}
        selectedValue={livestockType}
        onValueChange={setLivestockType}
        error={errors.livestockType}
      />

      <InputField
        label='Estimated Market Value (KSh.)'
        value={marketValue}
        onChange={(e) => setMarketValue(e.nativeEvent.text)}
        numbersOnly
        error={errors.marketValue}
      />

      <InputField
        label='Livestock Weight (Kgs.)'
        value={weight}
        onChange={(e) => setWeight(e.nativeEvent.text)}
        numbersOnly
        error={errors.weight}
      />

      <Dropdown
        label='Breed'
        options={[
          'Ayrshire',
          'Friesian',
          'Guernsey',
          'Jersey',
          'Sahiwal',
          'Zebu/indigenous',
        ].map((v) => ({ label: v, value: v }))}
        selectedValue={breed}
        onValueChange={setBreed}
        error={errors.breed}
      />

      <Dropdown
        label='Select Livestock Purpose'
        options={livestockOptions.map((v) => ({ label: v, value: v }))}
        selectedValue={purpose}
        onValueChange={setPurpose}
        error={errors.purpose}
      />

      <Dropdown
        label='General Health Status'
        options={healthStatus.map((v) => ({ label: v, value: v }))}
        selectedValue={health}
        onValueChange={setHealth}
        error={errors.health}
      />

      <Dropdown
        label='Veterinary Care'
        options={['Yes', 'No'].map((v) => ({ label: v, value: v }))}
        selectedValue={veterinaryCare}
        onValueChange={setVeterinaryCare}
        error={errors.veterinaryCare}
      />

      <Dropdown
        label='Gender'
        options={['Male', 'Female'].map((v) => ({ label: v, value: v }))}
        selectedValue={gender}
        onValueChange={setGender}
        error={errors.gender}
      />

      <Dropdown
        label='Livestock Condition'
        options={[
          'Healthy skin and body',
          'Diseased skin',
          'Body deformities',
        ].map((v) => ({ label: v, value: v }))}
        selectedValue={livestockCondition}
        onValueChange={setLivestockCondition}
        error={errors.livestockCondition}
      />

      <Dropdown
        label='Enter Number of calvings'
        options={['0', '1', '2', '3', '4', '5+'].map((v) => ({
          label: v,
          value: v,
        }))}
        selectedValue={numOfCalvings}
        onValueChange={setNumOfCalvings}
        error={errors.numOfCalvings}
      />

      <Dropdown
        label='Production stage'
        options={[
          'Open',
          'Pregnant',
          'Lactating',
          'Bred',
          'Calved',
          'Barren',
          'Heifer',
          'Dry',
        ].map((v) => ({ label: v, value: v }))}
        selectedValue={productionStage}
        onValueChange={setProductionStage}
        error={errors.productionStage}
      />

      <InputField
        label='Expected Monthly Milk Production (liters)'
        value={expectedMonthlyMilk}
        onChange={(e) => setExpectedMonthlyMilk(e.nativeEvent.text)}
        numbersOnly
        error={errors.expectedMonthlyMilk}
      />

      <InputField
        label='Actual Monthly Milk Production (liters)'
        value={actualMonthlyMilk}
        onChange={(e) => setActualMonthlyMilk(e.nativeEvent.text)}
        numbersOnly
        error={errors.actualMonthlyMilk}
      />

      <InputField
        label='Expected Monthly Weight Gain (kgs)'
        value={expectedMonthlyWeight}
        onChange={(e) => setExpectedMonthlyWeight(e.nativeEvent.text)}
        numbersOnly
        error={errors.expectedMonthlyWeight}
      />

      <InputField
        label='Actual Monthly Weight Gain (kgs)'
        value={actualMonthlyWeight}
        onChange={(e) => setActualMonthlyWeight(e.nativeEvent.text)}
        numbersOnly
        error={errors.actualMonthlyWeight}
      />

      <Dropdown
        label='Farm Type'
        options={['Zero-grazing', 'Free range', 'Pastoral'].map((v) => ({
          label: v,
          value: v,
        }))}
        selectedValue={farmType}
        onValueChange={setFarmType}
        error={errors.farmType}
      />

      <Dropdown
        label='Herd size'
        options={['Small (1-50)', 'Medium (51-200)', 'Large (201-500)'].map(
          (v) => ({ label: v, value: v }),
        )}
        selectedValue={herdSize}
        onValueChange={setHerdSize}
        error={errors.herdSize}
      />

      <CheckboxGroup
        label='Vaccination history (select one or more)'
        options={vaccinationOptions}
        selectedValues={vaccinations}
        onChange={setVaccinations}
        error={errors.vaccinations}
      />

      <CommonButton
        title={apiInProgress ? 'Updating...' : 'Update'}
        onPress={handleSubmit}
      />
      <AppModal visible={successModal}>
        <Text style={{ textAlign: 'center' }}>
          The form has been successfully validated. You may now proceed
        </Text>
        <TouchableOpacity onPress={handleAction}>
          <Text style={{ textAlign: 'center' }}>OK</Text>
        </TouchableOpacity>
      </AppModal>
      <AppModal visible={successModal}>
        <Text style={{ textAlign: 'center' }}>
          Livestock information updated successfully. This will be notified to
          the field officer in order to continue with further process.
          Meanwhilw, would you wish to update more livestock of the same farmer?
          Click Yes to Continue or No to Exit.
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 20,
          }}
        >
          <TouchableOpacity onPress={handleActionYes}>
            <Text style={{ textAlign: 'center' }}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleActionNo}>
            <Text style={{ textAlign: 'center' }}>No</Text>
          </TouchableOpacity>
        </View>
      </AppModal>
    </FormStepWrapper>
  )
}

export default StepUpdateLivestock

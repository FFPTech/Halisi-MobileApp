import { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { useAppSelector } from '../Hooks/hook'
import CommonButton from './CommonButtonComponent'
import Dropdown from './DropDown'
import FormStepWrapper from './FormStepWrapper'
import InputField from './InputComponent'
import PhoneInputField from './PhoneInputComponent'
import StepOperation from './StepOperation'

const COUNTRIES = ['Kenya', 'Democratic Republic of Congo'] as const
type CountryType = (typeof COUNTRIES)[number]

const cities: Record<CountryType, string[]> = {
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
  'Democratic Republic of Congo': [
    'Kinshasa',
    'Goma',
    'Lubumbashi',
    'Bukavu',
    'Kisangani',
  ],
}

const counties: Record<CountryType, string[]> = {
  Kenya: ['Nairobi', 'Kiambu', 'Machakos', 'Kisumu', 'Nakuru'],
  'Democratic Republic of Congo': [
    'Kinshasa',
    'Kongo Central',
    'North Kivu',
    'South Kivu',
    'Haut-Katanga',
  ],
}

export default function StepPersonalInfo({
  firstName,
  lastName,
  nationalId,
  gender,
  setFirstName,
  setLastName,
  setNationalId,
  setGender,
  country,
  setCountry,
  city,
  setCity,
  county,
  setCounty,
  accommodation,
  setAccommodation,
  residentialStatus,
  setResidentialStatus,
  phone,
  setPhone,
  monthlyIncome,
  setMonthlyIncome,
  isMemberCooperative,
  setIsMemberCooperative,
  nameOfCooperative,
  setNameOfCooperative,
  experience,
  setExperience,
  ageCategory,
  setAgeCategory,
  schooling,
  setSchooling,
  tenureWithFinancialInstitution,
  setTenureWithFinancialInstitution,
  annualIncome,
  setAnnualIncome,
  farmerKRAPin,
  setFarmerKRApin,
  rccm_number,
  setRCCMNumber,
  handleFarmerSubmit,
  nextStep,
  errors,
}) {
  const { openOperation } = useAppSelector((state) => state.farmer)

  /** ---------- ACTIVE COUNTRY (fallback to Kenya) ---------- */
  const activeCountry: CountryType = (country || COUNTRIES[0]) as CountryType

  const activeCities = useMemo(() => cities[activeCountry], [activeCountry])
  const activeCounties = useMemo(() => counties[activeCountry], [activeCountry])

  /** ---------- SET DEFAULT CITY & COUNTY ---------- */
  useEffect(() => {
    if (!city) setCity(activeCities[0])
    if (!county) setCounty(activeCounties[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCountry])

  /** ---------- PHONE PREFIX ---------- */
  const phonePrefix =
    activeCountry === 'Kenya'
      ? '+254'
      : activeCountry === 'Democratic Republic of Congo'
      ? '+243'
      : ''

  return (
    <>
      {openOperation ? (
        <StepOperation nextStep={nextStep} />
      ) : (
        <FormStepWrapper title='Step 3: Personal Information'>
          <View style={{ marginTop: 4, gap: 12 }}>
            {/* FIRST NAME */}
            <InputField
              label='First Name'
              value={firstName}
              onChangeText={setFirstName}
              error={errors.firstName}
            />

            {/* LAST NAME */}
            <InputField
              label='Surname'
              value={lastName}
              onChangeText={setLastName}
              error={errors.lastName}
            />

            {/* NATIONAL ID */}
            <InputField
              label='National ID'
              value={nationalId}
              onChangeText={setNationalId}
              error={errors.nationalId}
            />

            {/* COUNTRY */}
            <Dropdown
              label='Country'
              selectedValue={country}
              onValueChange={(val) => {
                setCountry(val)
                setCity('')
                setCounty('')
                setPhone('')
              }}
              options={COUNTRIES.map((c) => ({
                label: c,
                value: c,
              }))}
              error={!country ? 'Country is required' : undefined}
            />

            {/* CITY */}
            <Dropdown
              label='Town / City'
              selectedValue={city}
              onValueChange={setCity}
              options={activeCities.map((c) => ({
                label: c,
                value: c,
              }))}
            />

            {/* COUNTY / PROVINCE */}
            <Dropdown
              label='County / Province'
              selectedValue={county}
              onValueChange={setCounty}
              options={activeCounties.map((c) => ({
                label: c,
                value: c,
              }))}
            />

            {/* ACCOMMODATION */}
            <Dropdown
              label='Place of Living'
              selectedValue={accommodation}
              onValueChange={setAccommodation}
              options={[
                { label: 'Village', value: 'Village' },
                { label: 'Ward', value: 'Ward' },
                { label: 'County', value: 'County' },
              ]}
              error={errors.accommodation}
            />

            {/* RESIDENTIAL STATUS */}
            <Dropdown
              label='Residential Status'
              selectedValue={residentialStatus}
              onValueChange={setResidentialStatus}
              options={[
                { label: 'Rent', value: 'Rent' },
                { label: 'Own', value: 'Own' },
                { label: 'Live with Family', value: 'Live with Family' },
              ]}
              error={errors.residentialStatus}
            />

            {/* GENDER */}
            <Dropdown
              label='Gender'
              selectedValue={gender}
              onValueChange={setGender}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ]}
            />

            {/* PHONE */}
            <PhoneInputField
              label='Phone Number'
              prefix={phonePrefix}
              value={phone}
              onChangeText={setPhone}
              numbersOnly
              error={errors.phone}
            />

            {/* MONTHLY INCOME */}
            <InputField
              label={`Monthly Income (${
                activeCountry === 'Kenya' ? 'KES' : 'USD'
              })`}
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              numbersOnly
              error={errors.monthlyIncome}
            />

            {/* COOPERATIVE */}
            <Dropdown
              label='Cooperative Membership'
              selectedValue={isMemberCooperative}
              onValueChange={setIsMemberCooperative}
              options={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
              ]}
            />

            {isMemberCooperative === 'Yes' && (
              <InputField
                label='Name of Cooperative'
                value={nameOfCooperative}
                onChangeText={setNameOfCooperative}
                error={errors.nameOfCooperative}
              />
            )}

            {/* EXPERIENCE */}
            <InputField
              label='Experience (years)'
              value={experience}
              onChangeText={setExperience}
              numbersOnly
              error={errors.experience}
            />

            {/* AGE CATEGORY */}
            <Dropdown
              label='Age Category'
              selectedValue={ageCategory}
              onValueChange={setAgeCategory}
              options={[
                { label: '18-30 years', value: '18-30 years' },
                { label: '30-50 years', value: '30-50 years' },
                { label: '50+ years', value: '50+ years' },
              ]}
            />

            {/* SCHOOLING */}
            <Dropdown
              label='Schooling'
              selectedValue={schooling}
              onValueChange={setSchooling}
              options={[
                { label: 'Primary', value: 'Primary' },
                { label: 'Secondary', value: 'Secondary' },
                { label: 'Higher', value: 'Higher' },
              ]}
            />

            {/* TENURE */}
            <Dropdown
              label='Customer tenure with financial institution'
              selectedValue={tenureWithFinancialInstitution}
              onValueChange={setTenureWithFinancialInstitution}
              options={[
                { label: 'Old (5+ years)', value: 'Old(5+ years)' },
                { label: 'New (0–5 years)', value: 'New(0–5 years)' },
              ]}
            />

            {/* ANNUAL INCOME */}
            <InputField
              label={`Annual Income (${
                activeCountry === 'Kenya' ? 'KES' : 'USD'
              })`}
              value={annualIncome}
              onChangeText={setAnnualIncome}
              numbersOnly
              error={errors.annualIncome}
            />

            {/* COUNTRY-SPECIFIC ID */}
            {activeCountry === 'Kenya' && (
              <InputField
                label='Farmer KRA PIN'
                value={farmerKRAPin}
                onChangeText={setFarmerKRApin}
                error={errors.farmerKRAPin}
              />
            )}

            {activeCountry === 'Democratic Republic of Congo' && (
              <InputField
                label='Farmer RCCM Number'
                value={rccm_number}
                onChangeText={setRCCMNumber}
                error={errors.rccm_number}
              />
            )}
          </View>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <CommonButton title='Register' onPress={handleFarmerSubmit} />
          </View>
        </FormStepWrapper>
      )}
    </>
  )
}

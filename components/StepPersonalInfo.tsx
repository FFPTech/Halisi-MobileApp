// components/steps/StepPersonalInfo.tsx
import { Text, View, } from "react-native";
import CommonButton from "./CommonButtonComponent";
import Dropdown from "./DropDown";
import FormStepWrapper from "./FormStepWrapper";
import InputField from "./InputComponent";

const cities = {
  Kenya: ["Nairobi", "Mombasa", "Kisumu"],
  Congo: ["Kinshasa", "Goma", "Lubumbashi"],
};

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
  accommodation,
  setAccommodation,
  residentialStatus,
  setResidentialStatus,
  tenureWithFinancialInstitution,
  setTenureWithFinancialInstitution,
  annualIncome,
  setAnnualIncome,
  farmerKRAPin,
  setFarmerKRApin,
  handleFarmerSubmit,

  // 🔥 ADD THIS
  errors ,
}) {
  return (
    <FormStepWrapper title="Step 3: Personal Information">
      <View style={{ marginTop: 4, flexDirection: "column", gap: 12 }}>
        {/* -------------------- FIRST NAME -------------------- */}
        <InputField
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
        />

        {/* -------------------- LAST NAME -------------------- */}
        <InputField
          label="Surname"
          value={lastName}
          onChangeText={setLastName}
          error={errors.lastName}
        />

        {/* -------------------- NATIONAL ID -------------------- */}
        <InputField
          label="National ID"
          value={nationalId}
          onChangeText={setNationalId}
          error={nationalId.length === 0
            ? "National ID is required"
            : nationalId.length > 20
            ? "National ID cannot exceed 20 digits"
            : undefined}

        />
        

        {/* -------------------- COUNTRY -------------------- */}
        <Dropdown
          label="Country"
          selectedValue={country}
          onValueChange={setCountry}
          options={[
            { label: "Kenya", value: "Kenya" },
            { label: "Congo", value: "Congo" },
          ]}
        error={!country ? "Country is required" : undefined}
        />

        {/* -------------------- CITY -------------------- */}
        {country ? (
          <>
            <Dropdown
              label="City"
              selectedValue={city}
              onValueChange={setCity}
              options={(cities[country] || []).map((c) => ({
                label: c,
                value: c,
              }))}
            />
            {errors.city && (
              <Text style={{ color: "red" }}>{errors.city}</Text>
            )}
          </>
        ) : null}

        {/* -------------------- GENDER -------------------- */}
        <Dropdown
          label="Gender"
          selectedValue={gender}
          onValueChange={setGender}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        {errors.gender && (
          <Text style={{ color: "red" }}>{errors.gender}</Text>
        )}

        {/* -------------------- PHONE -------------------- */}
        <InputField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
        />

        {/* -------------------- MONTHLY INCOME -------------------- */}
        <InputField
          label="Monthly income"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
          error={errors.monthlyIncome}
        />

        {/* -------------------- COOPERATIVE -------------------- */}
        <Dropdown
          label="Cooperative membership"
          selectedValue={isMemberCooperative}
          onValueChange={setIsMemberCooperative}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
        />
        {errors.isMemberCooperative && (
          <Text style={{ color: "red" }}>{errors.isMemberCooperative}</Text>
        )}

        {isMemberCooperative === "Yes" && (
          <InputField
            label="Name of cooperative"
            value={nameOfCooperative}
            onChangeText={setNameOfCooperative}
            error={errors.nameOfCooperative}
          />
        )}

        {/* -------------------- EXPERIENCE -------------------- */}
        <InputField
          label="Experience (years)"
          value={experience}
          onChangeText={setExperience}
          error={errors.experience}
          numbersOnly
        />

        {/* -------------------- AGE CATEGORY -------------------- */}
        <Dropdown
          label="Age Category"
          selectedValue={ageCategory}
          onValueChange={setAgeCategory}
          options={[
            { label: "18-30 years old", value: "18-30 years old" },
            { label: "30-50 years old", value: "30-50 years old" },
            { label: "> 50 years old", value: "50 years old above" },
          ]}
        />
        {errors.ageCategory && (
          <Text style={{ color: "red" }}>{errors.ageCategory}</Text>
        )}

        {/* -------------------- SCHOOLING -------------------- */}
        <Dropdown
          label="Schooling"
          selectedValue={schooling}
          onValueChange={setSchooling}
          options={[
            { label: "literate", value: "Primary" },
            { label: "Secondary", value: "High School" },
            { label: "Sup", value: "Sup" },
          ]}
        />
        {errors.schooling && (
          <Text style={{ color: "red" }}>{errors.schooling}</Text>
        )}

        {/* -------------------- ACCOMMODATION -------------------- */}
        <Dropdown
          label="Select place of living"
          selectedValue={accommodation}
          onValueChange={setAccommodation}
          options={[
            { label: "Village", value: "village" },
            { label: "Ward", value: "Ward" },
            { label: "County", value: "County" },
          ]}
        />
        {errors.accommodation && (
          <Text style={{ color: "red" }}>{errors.accommodation}</Text>
        )}

        {/* -------------------- RESIDENTIAL STATUS -------------------- */}
        <Dropdown
          label="Residential Status"
          selectedValue={residentialStatus}
          onValueChange={setResidentialStatus}
          options={[
            { label: "Rent", value: "Rent" },
            { label: "Own", value: "Own" },
            { label: "Live with Family", value: "Live with Family" },
          ]}
        />
        {errors.residentialStatus && (
          <Text style={{ color: "red" }}>{errors.residentialStatus}</Text>
        )}

        {/* -------------------- TENURE -------------------- */}
        <Dropdown
          label="Customer tenure with financial institution"
          selectedValue={tenureWithFinancialInstitution}
          onValueChange={setTenureWithFinancialInstitution}
          options={[
            { label: "Old (5+ years)", value: "Old(5+ years)" },
            { label: "New (0-5 years)", value: "New(0-5years)" },
          ]}
        />
        {errors.tenureWithFinancialInstitution && (
          <Text style={{ color: "red" }}>
            {errors.tenureWithFinancialInstitution}
          </Text>
        )}

        {/* -------------------- ANNUAL INCOME -------------------- */}
        <InputField
          label="Select Annual Income (Ksh)"
          value={annualIncome}
          onChangeText={setAnnualIncome}
          error={errors.annualIncome}
        />

        {/* -------------------- KRA PIN -------------------- */}
        <InputField
          label="Farmer KRA PIN"
          value={farmerKRAPin}
          onChangeText={setFarmerKRApin}
          error={errors.farmerKRAPin}
        />
      </View>
      <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
        <CommonButton title="Register" onPress={()=>handleFarmerSubmit()}/>
      </View>
    </FormStepWrapper>
  );
}

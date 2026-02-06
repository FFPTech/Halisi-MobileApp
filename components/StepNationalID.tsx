// components/steps/StepNationalId.tsx
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeValidModal,
  handleShowValidNINOkAlert,
  openShowCameraComponent,
  queryDB,
  verifyNIN,
} from '../features/farmerSlice'
import type { AppDispatch } from '../store/store'
import { AppModal } from './AppModal'
import CommonButton from './CommonButtonComponent'
import Dropdown from './DropDown'
import FormStepWrapper from './FormStepWrapper'
import InputField from './InputComponent'
import LoadingSpinner from './LoadingSpinner'
import StepCamera from './StepCamera'
import ToggleButton from './ToggleComponent'

interface StepNationalIdProps {
  isEnabled: boolean
  setIsEnabled: (val: boolean) => void
  nationalId: string
  setNationalId: (val: string) => void
  country: string
  setCountry: (val: string) => void
  permission: { granted: boolean }
  requestPermission: () => void
  photoUri: string | null
  setPhotoUri: (uri: string | null) => void
  cameraRef: React.RefObject<any>
  facing: 'front' | 'back'
  toggleCameraFacing: () => void
  setPhotoBase64: (base64: string | null) => void
  species: 'farmer' | 'livestock'
  onpress: () => void
  errors?: {
    nationalId?: string
    country?: string
    photoUri?: string
  }
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
  onpress,
  errors = {},
}: StepNationalIdProps) {
  const dispatch = useDispatch<AppDispatch>()
  const {
    apiCallInProgress,
    showModalNotFound,
    showModalValid,
    showcameraComponent,
    showValidNINOkAlert,
  } = useSelector((state: any) => state.farmer)
  const agent = useSelector((state: any) => state.user.agent)
  // console.log(agent)

  // const [showcameraComponent, setShowCameraComponent] = useState(false)
  // const {
  //   verify_nin,
  //   loadingVerifyNiN,
  //   query_db,
  //   setLoadingVerifyNiN,
  //   setShowModalNationalIdNotRegistered,
  //   showModalNationalIdNotRegistered,
  // } = useUser()
  const [useIprsVerification, setUseIprsVerification] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // const handleSubmit = () => {
  //     if (isValidInput && farmerNationalNumber !== '') {
  //       setSuccessfulValidation(true);
  //       if (useIprsVerification) {
  //         verify_nin();
  //       } else {
  //         // Skip IPRS verification and go directly to DB query
  //         dispatch({ type: 'SET_FARMER_NATIONAL_NUMBER', payload: farmerNationalNumber });
  //         setApiCallInProgress(true);
  //         query_db(nationalId,country);
  //       }
  //     } else {
  //       setShowValidNINAlert(true);
  //     }
  //   };

  const handleCloseModalAlert = () => {
    dispatch(handleShowValidNINOkAlert(false))
    dispatch(openShowCameraComponent())
  }

  const handleSubmit = async () => {
    setSubmitted(true)

    if (!nationalId || !country) {
      return
    }

    if (useIprsVerification) {
      // await verify_nin(nationalId, country)
      console.log('using IPRS verification')

      dispatch(
        verifyNIN({
          farmerNationalNumber: nationalId,
          selectedCountry: country,
          agent,
        }),
      )
    } else {
      // setLoadingVerifyNiN(true)
      // await query_db(nationalId, country)
      console.log('Not using IPRS verification')

      dispatch(
        queryDB({
          farmerNationalNumber: nationalId,
          selectedCountry: country,
          agent,
        }),
      )

      // setLoadingVerifyNiN(false)
      // setShowModalNationalIdNotRegistered(true)
      // Alert.alert("Your NIN has been enrolled please Proceed to Registration");
    }
  }
  const handleCloseModal = () => {
    dispatch(openShowCameraComponent())
    dispatch(closeValidModal())
  }

  if (apiCallInProgress) {
    return <LoadingSpinner size='large' color='#2e7d32' />
  }

  return (
    <>
      {!showcameraComponent ? (
        <FormStepWrapper title='Step 1: Farmer National Identification Number'>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <Text style={{ width: 230, textAlign: 'center' }}>
              Use Population Registration System Verification
            </Text>
            <ToggleButton
              value={useIprsVerification}
              onChange={setUseIprsVerification}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Dropdown
              label='Country'
              selectedValue={country}
              onValueChange={setCountry}
              options={[
                { label: 'Kenya', value: 'Kenya' },
                {
                  label: 'Democratic Republic of Congo',
                  value: 'Democratic Republic of Congo',
                },
              ]}
              error={submitted && !country ? 'Country is required' : undefined}
              // <-- show error under dropdown
            />
          </View>

          {/* <AppModal visible={showValidNINNoIPRS} onClose={() => {}} title=''>
            <View>
              <Text>{iprsMessage}</Text>
            </View>
          </AppModal> */}

          <View style={{ marginTop: 20 }}>
            <InputField
              label='Farmer NIN'
              value={nationalId}
              onChangeText={setNationalId}
              placeholder='Enter Farmer NIN'
              error={
                submitted
                  ? nationalId.length === 0
                    ? 'National ID is required'
                    : nationalId.length > 20
                      ? 'National ID cannot exceed 20 digits'
                      : undefined
                  : undefined
              }
              numbersOnly // <-- show error under input
            />
          </View>

          <AppModal visible={showModalValid}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              The National Identification Number is valid but not yet
              registered. Please proceed with the registration process
            </Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>Ok</Text>
            </TouchableOpacity>
          </AppModal>
          <AppModal visible={showValidNINOkAlert}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              This Identification Number is valid and registered. Click OK to
              proceed with Biometrics verification
            </Text>
            <TouchableOpacity onPress={handleCloseModalAlert}>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>Ok</Text>
            </TouchableOpacity>
          </AppModal>
          <View
            style={{
              marginTop: 30,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CommonButton
              onPress={handleSubmit}
              title={agent.role === 'field_officer' ? 'submit' : 'verify'}
            />
          </View>
        </FormStepWrapper>
      ) : (
        <StepCamera
          permission={permission}
          requestPermission={requestPermission}
          photoUri={photoUri}
          setPhotoUri={setPhotoUri}
          cameraRef={cameraRef}
          facing={facing}
          toggleCameraFacing={toggleCameraFacing}
          setPhotoBase64={setPhotoBase64}
          species={species}
          errors={errors}
          onpress={onpress} // <-- REQUIRED
        />
      )}
    </>
  )
}

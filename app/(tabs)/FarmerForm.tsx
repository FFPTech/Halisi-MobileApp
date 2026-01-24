import { CameraType, useCameraPermissions } from 'expo-camera'
import React, { useRef, useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AppModal } from '../../components/AppModal'
import LoadingSpinner from '../../components/LoadingSpinner'
import { MultiStepComponent } from '../../components/MultiStep'
// import { RegisterAnotherLivestockScreen } from '../RegisterLiveStock'

import { send } from '@emailjs/react-native'
import { router } from 'expo-router'
import StepLivestock from '../../components/StepLivestock'
import StepNationalId from '../../components/StepNationalID'
import StepPersonalInfo from '../../components/StepPersonalInfo'
import StepUpdateLivestock from '../../components/StepUpdateLivestock'
import {
  OpenOperationScreen,
  setRecordId,
  setRecordIdLivestock,
  setRegistrationTimestamp,
  setShowFarmerRegistrationModal,
} from '../../features/farmerSlice'
import { useUser } from '../../Hooks/useUserGlobal'
import { getCurrentTimestamp } from '../../utils/utils'

// bundled logo asset

export default function RegisterFarmers() {
  const dispatch = useDispatch()
  const { agent, consent, companyData, consentTimestamp } = useSelector(
    (state: any) => state.user,
  )
  const {
    farmerData,
    operation,
    recordId,

    enrollDbData,

    registrationTimestamp,
    livestockRecordId,

    openOperation,
  } = useSelector((state: any) => state.farmer)
  console.log(farmerData)

  const {
    saveLivestock,

    step,
    setStep,
    box,
    loading,
  } = useUser()

  const totalSteps = 6
  const [isEnabled, setIsEnabled] = useState(false)
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<any>(null)
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string | null>(null)

  // Form data states
  const [firstName, setFirstName] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')

  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [nationalId, setNationalId] = useState('')

  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [isMemberCooperative, setIsMemberCooperative] = useState('')
  const [county, setCounty] = useState('')

  const [nameOfCooperative, setNameOfCooperative] = useState('')
  const [experience, setExperience] = useState()
  const [ageCategory, setAgeCategory] = useState()
  const [schooling, setSchooling] = useState()
  const [accommodation, setAccommodation] = useState()
  const [residentialStatus, setResidentialStatus] = useState()
  const [tenureWithFinancialInstitution, setTenureWithFinancialInstitution] =
    useState()
  const [annualIncome, setAnnualIncome] = useState()
  const [farmerKRAPin, setFarmerKRApin] = useState('')
  const [rccm_number, setRCCMNumber] = useState('')
  const [livestockPhotoUri, setLivestockPhotoUri] = useState<string | null>(
    null,
  )
  const [livestockTag, setLivestockTag] = useState('')
  const [apiCallInProgress, setApiCallInProgress] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const base64Header = 'data:image/jpeg;base64,'
  const [showOperation, setShowOperation] = useState(false)
  const [showAPiMessage, setShowApiMessage] = useState('')
  const [loadingFarmerRegApi, setLoadingFarmerRegApi] = useState(false)
  const [isLivestockSuccess, setIsLivestockSuccess] = useState(false)
  const isEdenbridge = agent.institution?.[0] === 'Edenbridge Capital'
  // const [registerNewLivestock, setRegisterNewLivestock] = useState(false)
  // const [showFarmerRegistered, setShowFarmerRegistered] = useState(false)

  // console.log(photoBase64);

  const handleFarmerForm = async (apidata) => {
    try {
      console.log('Starting API call')
      setLoadingFarmerRegApi(true)
      console.log('record ID', recordId)
      console.log('operation', operation)
      // console.log('UUID', farmerData.identifier)
      console.log('agent data', agent.agent_id, agent.company_id)
      let updatedSubmitJsonData = {}
      updatedSubmitJsonData = Object.assign({}, apidata)
      let data = {
        record: updatedSubmitJsonData,
        record_id: recordId,
        env: 'Qua',
        operation: operation || 'register',
        uuid: farmerData?.identifier || '',
        agent_id: agent.agent_id,
        institution_id: agent.company_id,
      }
      console.log(data)
      const response = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/updatefarmer',
        data,
      )

      console.log('Sent awaiting response')

      const res = response.data
      console.log(res)

      if (res.success) {
        Alert.alert('Successfully registered')
      }
      dispatch(setShowFarmerRegistrationModal(true))
      setLoadingFarmerRegApi(false)
      const ts = getCurrentTimestamp()
      dispatch(setRegistrationTimestamp(ts))
      // clearFarmerForm()
    } catch (error) {
      setLoadingFarmerRegApi(false)
      console.log('There was an error', error)
      console.log('There was an error', error)

      Alert.alert(
        'There was an error',
        error?.response?.data?.message ||
          error.message ||
          'Something went wrong',
      )
    }
  }

  const handleLivestockRegSuccess = () => {
    setIsLivestockSuccess(false) // 1️ close modal
    // dispatch(setRegisterNewLivestock(true))
    // dispatch(setCloseGotoRegistration(false)) // 2️ switch screen
    router.replace('/RegisterLiveStock')
  }

  const clearFarmerForm = () => {
    setFirstName('')
    setLastName('')
    setAccommodation(null)
    setAgeCategory(null)
    setCity('')
    setCountry('')
    setCounty('')
    setErrors({})
    setExperience(null)
    setFarmerKRApin('')
    setGender('')
    setPhotoUri('')
    setIsMemberCooperative('')
    setMonthlyIncome(null)
    setAnnualIncome(null)
    setRCCMNumber('')
    setNationalId('')
    setPhone('')
    setResidentialStatus(null)
    setSchooling(null)
    setTenureWithFinancialInstitution(null)
  }

  const writeToRecord = (reqData) => {
    let updatedSubmitJsonData = {}

    updatedSubmitJsonData = Object.assign({}, reqData, {
      consent: true,
      agent_name: agent.name ?? '',
      agent_institution: agent.institutions[0] ?? '',
      agent_email: agent?.mic_email_id ?? '',
      agent_verified_email: agent?.mic_email_id ?? false,
      agent_id: agent.agent_id ?? '',
      institution_id: agent.company_id ?? '',

      // Conditionally add fields:
      ...(operation === 'register' && agent.role === 'field_officer'
        ? {
            agent_id_registration: agent.agent_id ?? '',
            agent_name_registration: agent?.name ?? '',
            agent_institution_registration: agent.institutions[0] ?? '',
            agent_email_registration: agent.mic_email_id ?? '',
            agent_verified_email_registration: agent?.mic_email_id ?? false,
            agent_institution_id_registration: agent.company_id ?? '',
          }
        : {}),

      ...(operation === 'update' && agent.role === 'field_officer'
        ? {
            agent_id_request: agent.agent_id ?? '',
            agent_name_request: agent?.name ?? '',
            agent_institution_request: agent.institutions[0] ?? '',
            agent_email_request: agent?.mic_email_id ?? '',
            agent_verified_email_request: agent?.mic_email_id ?? false,
            agent_institution_id_request: agent.company_id ?? '',
          }
        : {}),

      ...(operation === 'update' && agent.role === 'veterinarian'
        ? {
            veterinarian_id: agent.agent_id ?? '',
            veterinarian_name_request: agent?.name ?? '',
            veterinarian_institution_request: agent.institutions[0] ?? '',
            veterinarian_email_request: agent?.mic_email_id ?? '',
            veterinarian_verified_email_request: agent?.mic_email_id ?? false,
            veterinarian_institution_id_request: agent.company_id ?? '',
          }
        : {}),
    })
    let data = {
      record: updatedSubmitJsonData,
      env: 'Qua',
    }

    axios
      .post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/createfarmer',

        data,
        { timeout: 20000 },
      )
      .then((data) => {
        let res = data.data
        if (res.success) {
          // dispatch({ type: 'SET_RECORD_ID', payload:res.record_id});
          dispatch(setRecordId(res.record_id))
        } else {
          // setRecheckMessage(true);
          Alert.alert('Error', 'Failed to create farmer record')
        }
      })
  }

  //Send Email

  const send_email_mfi = async (livestock_record_id) => {
    let templateParams

    const recipientEmails = isEdenbridge
      ? agent.email // Single agent email for Edenbridge
      : [agent.company_email_id, agent.mic_email_id].filter(Boolean).join(',')

    if (operation === 'register') {
      templateParams = {
        subject: 'New Farmer & New Livestock Registration',
        email_body:
          'We are writing to inform you that a new farmer has been successfully registered on the Halisi platform. Please find below the registration details.',
        from_name: 'info@neotex.ai',
        to_email: recipientEmails,
        financial_institution_name: agent.institution[0],
        halisi_livestock_registration_id: livestock_record_id,
        halisi_farmer_registration_id: recordId,
        registration_date: registrationTimestamp,
        farmer_name: `${firstName || ''} ${lastName || ''}`,
        field_officer_name: agent.name || '',
        consent_timestamp: consentTimestamp,
      }
    } else {
      templateParams = {
        subject: 'Registered Farmer - Additional Livestock Registration',
        email_body:
          'We are writing to inform you that an existing farmer on the Halisi platform has successfully registered additional livestock. Please find the registration details below.',
        from_name: 'info@neotex.ai',
        to_email: agent.mic_email_id,
        financial_institution_name: agent.institution[0],
        halisi_livestock_registration_id: livestock_record_id,
        halisi_farmer_registration_id: recordId,
        registration_date: registrationTimestamp,
        farmer_name: `${firstName || ''} ${lastName || ''}`,
        field_officer_name: agent.name || '',
        consent_timestamp: consentTimestamp,
      }
    }

    try {
      const response = await send(
        'service_7x1fjqm',
        'template_1qqxe0v',
        templateParams,
        { publicKey: 'iaVah_L30iq6IQXoc' },
      )

      console.log('Email sent successfully!', response.status, response.text)
      return response
    } catch (error) {
      console.error('Failed to send email. Error:', error)
      throw error
    }
  }

  // write to DB
  const writeToRecordLivestock = async (apidata) => {
    try {
      let updatedSubmitJsonData = {}

      updatedSubmitJsonData = Object.assign({}, apidata, {
        farmer_identifier: enrollDbData?.identifier || '',
        farmer_record_id: recordId,
        agent_id: agent.agent_id || '',
        institution_id: agent.company_id || '',
        livestock_id_number: livestockTag || '',
        status: 'Unverified',
        registrationTimestamp: new Date().toISOString(),
        company_email_id: companyData.company_email_id || null,
        financial_institution_name: Array.isArray(agent.institution)
          ? agent.institution[0]
          : agent.institution,
        mic_email_id: agent.mic_email_id || '',
        mic_name: agent.mic_name || '',
      })

      const data = {
        record: updatedSubmitJsonData,
        env: 'Qua',
      }

      const response = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/createlivestock',
        data,
        { timeout: 20000 }, // 20 seconds
      )

      const res = response.data

      if (res.success) {
        dispatch({
          type: 'SET_LIVESTOCK_RECORD_ID',
          payload: res.record_id,
        })
        dispatch(setRecordIdLivestock(res.record_id))
        return res
      } else {
        // setRecheckMessage(true)
        throw res
      }
    } catch (error) {
      console.error('Create livestock error:', error)
      throw error
    }
  }

  const handleLivestockSubmit = async () => {
    try {
      if (!livestockTag.trim()) {
        Alert.alert('Error', 'Livestock tag is required')
        return
      }

      if (!livestockPhotoUri) {
        Alert.alert('Error', 'Please capture livestock photo')
        return
      }

      if (!nationalId) {
        Alert.alert('Error', 'Missing farmer ID. Please restart process.')
        return
      }

      await saveLivestock({
        livestock_tag: livestockTag,
        photo_uri: livestockPhotoUri,
        farmer_id: nationalId, // <-- Automatically added!
      })

      Alert.alert('Success', 'Livestock registered successfully!')
    } catch (error) {
      Alert.alert('Error registering livestock', error.message)
    }
  }

  const apidata = {
    farmer_firstname: firstName,
    farmer_surname: lastName,
    farmer_national_id: nationalId,
    farmer_county: county,
    farmer_town: city,
    farmer_mobile_number: phone,
    farmer_monthly_income: monthlyIncome,
    farmer_farm_membership: isMemberCooperative,
    farmer_experience: experience,
    farmer_gender: gender,
    farmer_age_category: ageCategory,
    farmer_schooling: schooling,
    farmer_place_of_living: accommodation,
    farmer_residential_status: residentialStatus,
    farmer_type_of_customer: tenureWithFinancialInstitution,
    farmer_annual_income: annualIncome,
    farmer_country: country,
    kra_pin: farmerKRAPin,
    rccm_number: rccm_number,
    consent: consent,
    agent_id: agent.agent_id,
    institution_id: agent.company_id,
    agent_name: agent.name,
    agent_institution: agent.institutions[0],
    agent_email: agent.mic_email_id,
    agent_verified_email: agent.mic_email_id,
  }

  const callPerformanceMetrics = async (type, response) => {
    try {
      const payload = {
        record: {
          agent_id: agent.agent_id,
          institution_id: agent.company_id,
          request_source: 'Halisi_V1.0',
          API_function: type === 'verify' ? 'VerifyFarmer' : 'EnrollFarmer',
          API_verification_result: type === 'verify' ? response.match : null,
          Manual_verification_result: null,
          timeStamp: response.timestamp,
          API_verification_score: response.score ?? null,
          API_Deduplication_result:
            type === 'enroll' ? response.dedup_result : null,
          API_Deduplication_score:
            type === 'enroll' ? response.dedup_score : null,
        },
        env: 'Qua',
      }

      await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/getperformancemetrics',
        payload,
      )
    } catch (err) {
      console.error('Error fetching performance metrics:', err)
    }
  }

  const handlefarmerRegister = () => {
    console.log('Sending request')

    if (!validateStep()) {
      console.log('There was an error', errors)
      return
    }

    handleFarmerForm(apidata)
    console.log('request sent')
    setShowOperation(true)
  }

  const toggleCameraFacing = () =>
    setFacing((current) => (current === 'back' ? 'front' : 'back'))

  // Capture photo

  // Validation before moving to next step
  const validateStep = () => {
    const newErrors: { [key: string]: string } = {}

    switch (step) {
      case 1:
        if (!nationalId?.trim())
          newErrors.nationalId = 'National ID is required'
        if (!country?.trim()) newErrors.country = 'Country is required'
        if (!photoUri) newErrors.photoUri = 'Profile photo is required'
        break

      case 2:
        if (!firstName?.trim()) newErrors.firstName = 'First Name is required'
        if (!lastName?.trim()) newErrors.lastName = 'Last Name is required'

        if (!gender?.trim()) newErrors.gender = 'Gender is required'
        if (!nationalId?.trim())
          newErrors.nationalId = 'National ID is required'
        if (!monthlyIncome?.trim())
          newErrors.monthlyIncome = 'Monthly income is required'

        if (isMemberCooperative === 'Yes' && !nameOfCooperative?.trim())
          newErrors.nameOfCooperative = 'Cooperative name is required'

        if (!experience) newErrors.experience = 'Experience is required'
        if (!ageCategory) newErrors.ageCategory = 'Age category is required'
        if (!schooling) newErrors.schooling = 'Schooling is required'
        if (!accommodation)
          newErrors.accommodation = 'Accommodation is required'
        if (!residentialStatus)
          newErrors.residentialStatus = 'Residential status is required'
        if (!tenureWithFinancialInstitution)
          newErrors.tenureWithFinancialInstitution = 'Tenure is required'
        if (!annualIncome) newErrors.annualIncome = 'Annual income is required'

        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      if (step === 2) {
        // setShowOperation(true)
        dispatch(OpenOperationScreen(true))
        if (openOperation) {
          setStep(step + 1)
        }
      } else {
        setStep(step + 1)
      }
    }
  }

  //handleSubmit function for farmer verification and enrollment
  const handleSubmit = () => {
    setApiCallInProgress(true)
    setIsSubmit(true)
    console.log('Hello world')
    // console.log("No photo",photoBase64);
    if (!photoBase64) {
      console.log('No photo', photoBase64)
      // photoBase64
      Alert.alert('Please take a picture')
      setIsSuccess(false)
      // Dispatch action to save res object
    } else {
      let rect = [
        parseInt(box[0]),
        parseInt(box[1]),
        parseInt(box[2]),
        parseInt(box[3]),
      ]

      if (operation !== 'register') {
        let t0 = performance.now()
        let data = {
          agent_id: agent.agent_id,
          institution_id: agent.institution_id,
          image: photoBase64,
          signature: farmerData.signature,
          id: farmerData.id,
          rect: rect,
          moveable_rect: rect,
        }
        console.log('plese let me see', data)

        axios
          .post(
            'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/verifyfarmer',
            data,
          )
          .then((data) => {
            let humanVerifyAPIResponse = data.data
            // calling performance metrics API function
            callPerformanceMetrics('verify', humanVerifyAPIResponse)
            setApiCallInProgress(false)
            setPhotoUri(base64Header + humanVerifyAPIResponse.image)
            // setAPIResponseImgSrc(base64Header + humanVerifyAPIResponse.image);
            // dispatch({ type: 'SET_FARMER_VERIFY_API_RESPONSE', payload: humanVerifyAPIResponse }); // Dispatch action to save res object
            // let t1 = performance.now();
            // let total = parseInt(t1 - t0);
            // setTotalEnrollTimeFarmer(total);
            if (humanVerifyAPIResponse.match === false) {
              // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:base64Header + humanVerifyAPIResponse.image});
              // setPhotoUri(base64Header + humanVerifyAPIResponse.image)
              setApiCallInProgress(false)
              // setSuccessfulAPIcall(true);
              setIsSuccess(false)
              Alert.alert('Verification Failed', 'Face does not match')
              // setShowFaceMatchNo(true);
            } else if (humanVerifyAPIResponse.match === true) {
              // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:base64Header + humanVerifyAPIResponse.image});
              setPhotoUri(base64Header + humanVerifyAPIResponse.image)
              setApiCallInProgress(false)
              // setSuccessfulAPIcall(true);
              setIsSuccess(true)
              // setShowFaceMatchOk(true);
            } else {
              setApiCallInProgress(false)
              setIsSuccess(false)
              //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
              // setFaceNotDetected(true);
            }
          })
          .catch((err) => {
            if (err.response.status === 501 || err.response.status === 404)
              setApiCallInProgress(false)
            Alert.alert(err.message)
            setIsSuccess(false)
            // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
            // setFaceNotDetected(true);
          })
      } else {
        let t0 = performance.now()

        let data = {
          image: photoBase64,
          agent_id: agent.agent_id,
          institution_id: agent.company_id,
          rect: box,
          request_source: 'Halisi_V1.0',
          moveable_rect: box,
        }
        console.log(data)
        axios
          .post(
            'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/enrollfarmer',
            data,
          )
          .then((data) => {
            let humanEnrollAPIResponse = data.data
            console.log('data', data.data)

            callPerformanceMetrics('enroll', humanEnrollAPIResponse)
            // dispatch({ type: 'SET_FARMER_ENROLL_API_RESPONSE', payload: humanEnrollAPIResponse }); // Dispatch action to save res object
            // setAPIResponseImgSrc(base64Header + humanEnrollAPIResponse.image);
            setPhotoUri(base64Header + humanEnrollAPIResponse.image)
            // Alert.alert(data.data.message)
            setShowApiMessage(data.data.message)
            // let t1 = performance.now();
            // let total = parseInt(t1 - t0);
            // setTotalEnrollTimeFarmer(total);
            if (humanEnrollAPIResponse.dedup_result === true) {
              // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
              setApiCallInProgress(false)
              // setSuccessfulAPIcall(true);
              setIsSuccess(false)
              // setShowDuplicateAlert(true);
            } else {
              if (
                humanEnrollAPIResponse.signature === 'None' ||
                humanEnrollAPIResponse.signature === null ||
                humanEnrollAPIResponse.signature === undefined
              ) {
                //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
                setApiCallInProgress(false)
                setIsSuccess(false)
                setShowApiMessage(data.data.message)
                // setFaceNotDetected(true);
              } else {
                //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:base64Header + humanEnrollAPIResponse.image});
                setApiCallInProgress(false)
                // setSuccessfulAPIcall(true);
                writeToRecord(humanEnrollAPIResponse)
                setIsSuccess(true)
                // Alert.alert(data.data.message)
                //add description
                setShowApiMessage(data.data.message)
                setPhotoUri(base64Header + humanEnrollAPIResponse.image)
                // setStep(2)
                // setShowEnrolledMessage(true);
              }
            }
          })
          .catch((err) => {
            if (err.response.status === 501 || err.response.status === 404)
              setIsSuccess(false)
            setApiCallInProgress(false)
            console.log('There was an error', err)
            Alert.alert(err.message)

            //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
            // setFaceNotDetected(true);
          })
      }
    }
  }

  const callPerformanceMetricsForLivestock = async (type, response) => {
    try {
      const payload = {
        record: {
          agent_id: agent.agent_id,
          insitution_id: agent.company_id,
          request_source: 'Halisi_v1.0',
          API_function:
            type === 'verify' ? 'verifyLivestock' : 'EnrollLivetock',
          Manual_verificaton: null,
          timeStamp: response.timestamp,
          API_verification_score: response.score ?? null,
          API_Deduplication_result:
            type === 'enroll' ? response.dedupresult : null,
          API_Deduplication_score:
            type === 'enroll' ? Number(response.dedup_score) : null,
        },
        env: 'Qua',
      }
      const resp = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/getPerformancemetrics',
        payload,
      )
      console.log(resp)
    } catch (error) {
      console.log('Error fetching performance metrics for livestock:', error)
    }
  }

  const handleSubmitLivestockBiometrics = () => {
    setApiCallInProgress(true)

    setIsSubmit(true)
    console.log('Hello')
    // console.log("No photo",photoBase64);
    if (!photoBase64) {
      console.log('No photo', photoBase64)
      // photoBase64
      Alert.alert('Please take a picture')
      setApiCallInProgress(false)
      setIsLivestockSuccess(false)
      // Dispatch action to save res object
    } else {
      let rect = [
        parseInt(box[0]),
        parseInt(box[1]),
        parseInt(box[2]),
        parseInt(box[3]),
      ]

      if (operation !== 'register') {
        let t0 = performance.now()
        let data = {
          agent_id: agent.agent_id,
          institution_id: agent.company_id,
          image: photoBase64,
          signature: farmerData.signature,
          id: farmerData.identifier,
          rect: rect,
          moveable_rect: rect,
        }
        console.log('plese let me see', data)

        axios
          .post(
            'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/verifylivestock',
            data,
          )
          .then((data) => {
            let livestockVerifyAPIResponse = data.data
            // calling performance metrics API function
            callPerformanceMetricsForLivestock(
              'verify',
              livestockVerifyAPIResponse,
            )
            setApiCallInProgress(false)
            // setAPIResponseImgSrc(base64Header + humanVerifyAPIResponse.image);
            // dispatch({ type: 'SET_FARMER_VERIFY_API_RESPONSE', payload: humanVerifyAPIResponse }); // Dispatch action to save res object
            // let t1 = performance.now();
            // let total = parseInt(t1 - t0);
            // setTotalEnrollTimeFarmer(total);
            if (livestockVerifyAPIResponse.match === false) {
              // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:base64Header + livestockVerifyAPIResponse.image});
              setLivestockPhotoUri(
                base64Header + livestockVerifyAPIResponse.image,
              )
              setApiCallInProgress(false)
              // setSuccessfulAPIcall(true);
              setIsLivestockSuccess(false)
              // setShowFaceMatchNo(true);
            } else if (livestockVerifyAPIResponse.match === true) {
              // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:base64Header + livestockVerifyAPIResponse.image});
              setLivestockPhotoUri(
                base64Header + livestockVerifyAPIResponse.image,
              )
              setApiCallInProgress(false)

              setIsLivestockSuccess(true)
              // setShowFaceMatchOk(true);
            } else {
              setApiCallInProgress(false)
              setIsLivestockSuccess(false)
              //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
              // setFaceNotDetected(true);
              Alert.alert('Face not detected, please try again')
            }
          })
          .catch((err) => {
            if (err.response.status === 501 || err.response.status === 404)
              setApiCallInProgress(false)
            setIsLivestockSuccess(false)
            // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
            // setFaceNotDetected(true);
          })
      } else {
        let t0 = performance.now()

        let data = {
          image: photoBase64,
          agent_id: agent.agent_id,
          institution_id: agent.company_id,
          rect: box,
          request_source: 'Halisi_V1.0',
          moveable_rect: box,
        }
        console.log(data)
        axios
          .post(
            'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/enrolllivestock',
            data,
          )
          .then((data) => {
            let livestockEnrollAPIResponse = data.data
            console.log('data', data.data)

            callPerformanceMetrics('enroll', livestockEnrollAPIResponse)
            // dispatch({ type: 'SET_FARMER_ENROLL_API_RESPONSE', payload: livestockEnrollAPIResponse }); // Dispatch action to save res object
            setLivestockPhotoUri(
              base64Header + livestockEnrollAPIResponse.image,
            )
            // Alert.alert(data.data.message)
            // let t1 = performance.now();
            // let total = parseInt(t1 - t0);
            // setTotalEnrollTimeFarmer(total);
            if (livestockEnrollAPIResponse.dedup_result === true) {
              // dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});

              setApiCallInProgress(false)

              setLivestockPhotoUri(null)
              // setLivestockTag('')
              // setSuccessfulAPIcall(true);
              setIsLivestockSuccess(false)
              // setShowDuplicateAlert(true);
            } else {
              if (
                livestockEnrollAPIResponse.signature === 'None' ||
                livestockEnrollAPIResponse.signature === null ||
                livestockEnrollAPIResponse.signature === undefined
              ) {
                //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
                setApiCallInProgress(false)
                setIsLivestockSuccess(false)
                Alert.alert('Face not detected, please try again')
                // setFaceNotDetected(true);
              } else {
                //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:base64Header + livestockEnrollAPIResponse.image});
                setLivestockPhotoUri(
                  base64Header + livestockEnrollAPIResponse.image,
                )
                setApiCallInProgress(false)
                // setSuccessfulAPIcall(true);
                writeToRecordLivestock(livestockEnrollAPIResponse)
                setIsLivestockSuccess(true)
                // Alert.alert(data.data.message)
                send_email_mfi(livestockRecordId)
                //add description
                setShowApiMessage(data.data.message)
                // setShowEnrolledMessage(true);
              }
            }
          })
          .catch((err) => {
            if (err.response.status === 501 || err.response.status === 404)
              setIsLivestockSuccess(false)
            setApiCallInProgress(false)
            Alert.alert(err.message)
            console.log('There was an error', err)

            //dispatch({ type: 'SET_API_RESPONSE_IMG_SRC', payload:null});
            // setFaceNotDetected(true);
          })
      }
    }
  }
  const prevStep = () => setStep(step - 1)

  const handleAction = () => {
    setIsSuccess(false)
    setStep(2)
  }

  // Step content rendering
  const renderStepContent = () => {
    if (!permission) return <View />

    switch (step) {
      case 1:
        return (
          <StepNationalId
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
            nationalId={nationalId}
            setNationalId={setNationalId}
            country={country}
            setCountry={setCountry}
            permission={permission}
            requestPermission={requestPermission}
            photoUri={photoUri}
            setPhotoUri={setPhotoUri}
            cameraRef={cameraRef}
            facing={facing}
            toggleCameraFacing={toggleCameraFacing}
            setPhotoBase64={setPhotoBase64}
            species='farmer'
            onpress={handleSubmit}
            errors={errors} // <-- REQUIRED
          />
        )

      case 2:
        return (
          <StepPersonalInfo
            firstName={firstName}
            lastName={lastName}
            gender={gender}
            nationalId={nationalId}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setGender={setGender}
            setNationalId={setNationalId}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            phone={phone}
            setPhone={setPhone}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            isMemberCooperative={isMemberCooperative}
            setIsMemberCooperative={setIsMemberCooperative}
            nameOfCooperative={nameOfCooperative}
            setNameOfCooperative={setNameOfCooperative}
            experience={experience}
            setExperience={setExperience}
            ageCategory={ageCategory}
            setAgeCategory={setAgeCategory}
            schooling={schooling}
            setSchooling={setSchooling}
            accommodation={accommodation}
            setAccommodation={setAccommodation}
            residentialStatus={residentialStatus}
            setResidentialStatus={setResidentialStatus}
            annualIncome={annualIncome}
            setAnnualIncome={setAnnualIncome}
            tenureWithFinancialInstitution={tenureWithFinancialInstitution}
            setTenureWithFinancialInstitution={
              setTenureWithFinancialInstitution
            }
            farmerKRAPin={farmerKRAPin}
            setFarmerKRApin={setFarmerKRApin}
            errors={errors}
            handleFarmerSubmit={handlefarmerRegister}
            nextStep={nextStep}
            county={county}
            setCounty={setCounty}
            rccm_number={rccm_number}
            setRCCMNumber={setRCCMNumber}
          />
        )

      case 3:
        return (
          <StepLivestock
            nextStep={nextStep}
            livestocktag={livestockTag}
            setLivestockTag={setLivestockTag}
            errors={errors}
            permission={permission}
            requestPermission={requestPermission}
            livestockPhotoUri={livestockPhotoUri}
            setLivestockPhotoUri={setLivestockPhotoUri}
            cameraRef={cameraRef}
            facing={facing}
            toggleCameraFacing={toggleCameraFacing}
            setPhotoBase64={setPhotoBase64}
            handleSubmitLivestock={handleSubmitLivestockBiometrics}
          />
        )
      case 4:
        return <StepUpdateLivestock />
    }
  }

  if (loadingFarmerRegApi) {
    return <LoadingSpinner size='large' color='#2e7d32' />
  }

  // if (ratings) {
  //   return <RatingScreen />
  // }
  // if (registerNewLivestock) {
  //   return <RegisterAnotherLivestockScreen />
  // }

  if (loading) {
    return <LoadingSpinner size='large' color='#2e7d32' />
  }

  if (apiCallInProgress) {
    return <LoadingSpinner size='large' color='#2e7d32' />
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>
          {step >= 3 ? 'Livestock Authentication' : 'Farmer Authentication'}
        </Text>

        {/* Step Indicator */}
        <MultiStepComponent setStep={setStep} step={step} />

        {renderStepContent()}

        {/* Navigation Buttons */}
        {/* Navigation Buttons */}
        {step <= totalSteps && (
          <View style={styles.buttonContainer}>
            {/* Back button */}
            {step > 1 && (
              <TouchableOpacity style={styles.nextButton} onPress={prevStep}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            )}

            {/* Step-specific action button */}
            {(() => {
              switch (step) {
                case 3: // Submit Farmer Info
                  return (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={nextStep}
                    >
                      <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                  )

                case 6: // Submit Livestock Info
                  return (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={async () => {
                        const newErrors: { [key: string]: string } = {}

                        if (!livestockTag?.trim())
                          newErrors.livestockTag = 'Livestock tag is required'
                        if (!livestockPhotoUri)
                          newErrors.livestockPhotoUri =
                            'Livestock photo is required'

                        setErrors(newErrors)

                        if (Object.keys(newErrors).length === 0) {
                          try {
                            await handleLivestockSubmit() // submit livestock
                            Alert.alert(
                              'Success',
                              'Farmer and livestock registration complete!',
                            )
                            // router.replace("/RegisterLiveStock"); // redirect after submission
                          } catch (e) {
                            console.error('Error saving livestock:', e)
                            Alert.alert('Error', 'Failed to save livestock')
                          }
                        }
                      }}
                    >
                      <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
                  )

                default: // Next Step for all other steps
                  return (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={nextStep}
                    >
                      <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                  )
              }
            })()}
          </View>
        )}
      </ScrollView>
      <AppModal visible={isSuccess}>
        <Text
          style={{ textAlign: 'center' }}
        >{`Farmer's ${showAPiMessage}`}</Text>
        <TouchableOpacity onPress={handleAction}>
          <Text style={{ textAlign: 'center' }}>OK</Text>
        </TouchableOpacity>
      </AppModal>
      <AppModal visible={isLivestockSuccess}>
        <Text
          style={{ textAlign: 'center' }}
        >{`Livestock ${showAPiMessage}`}</Text>
        <TouchableOpacity onPress={handleLivestockRegSuccess}>
          <Text style={{ textAlign: 'center' }}>OK</Text>
        </TouchableOpacity>
      </AppModal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16, backgroundColor: '' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#133d23',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 14,
    gap: 6,
  },
  stepItem: { marginHorizontal: 6 },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeStepCircle: { backgroundColor: '#2e7d32' },
  stepText: { color: '#2e7d32', fontWeight: '700' },
  activeStepText: { color: '#fff' },

  stepCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    // borderRadius: 10,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.06,
    // shadowRadius: 6,
    // elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2e7d32',
  },

  permissionContainer: { alignItems: 'center', justifyContent: 'center' },
  permissionText: { textAlign: 'center', fontSize: 16, marginBottom: 10 },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },

  reviewContainer: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftColumn: { flex: 1, alignItems: 'center' },
  rightColumn: { flex: 2 },
  reviewImage: { width: 100, height: 100, borderRadius: 8 },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: { fontWeight: '700', marginTop: 8, color: '#444', fontSize: 13 },
  value: { color: '#000', fontSize: 14 },

  reviewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
})

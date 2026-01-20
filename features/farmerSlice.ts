// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import axios from 'axios'
// import { RootState } from '../store/store'
// import { getCountryCode } from '../utils/utils'

// /* -------------------- TYPES -------------------- */

// export interface FarmerIPRSData {
//   firstName?: string
//   middleName?: string
//   lastName?: string
//   country?: string
//   dateOfBirth?: string
//   gender?: string
//   idNumber?: string
//   idType?: string
//   mainAddress?: string
//   mobileTelephoneNumber?: string
//   identifier?: string
//   signature?: string
// }

// interface FarmerState {
//   farmerNationalNumber: string
//   farmerData: FarmerIPRSData | null
//   enrollDbData: any | null
//   recordId: string | null
//   operation: 'register' | 'update' | null

//   apiCallInProgress: boolean
//   iprsStatus: boolean
//   iprsMessage: string | null

//   showcameraComponent: boolean
//   showModalNotFound: boolean
//   showValidNINNoIPRS: boolean
//   showValidNINNoAlert: boolean
//   showValidNINOkAlert: boolean
//   showModalValid: boolean
//   openOperation: boolean
//   error: boolean
// }

// /* -------------------- INITIAL STATE -------------------- */

// const initialState: FarmerState = {
//   farmerNationalNumber: '',
//   farmerData: null,
//   enrollDbData: null,
//   recordId: null,
//   operation: null,

//   apiCallInProgress: false,
//   iprsStatus: false,
//   iprsMessage: null,

//   showModalNotFound: false,
//   showValidNINNoIPRS: false,
//   showValidNINNoAlert: false,
//   showValidNINOkAlert: false,
//   showModalValid: false,
//   showcameraComponent: false,
//   error: false,
//   openOperation: false,
// }

// /* -------------------- VERIFY NIN -------------------- */

// export const verifyNIN = createAsyncThunk<
//   void,
//   { farmerNationalNumber: string; selectedCountry: string },
//   { state: RootState }
// >(
//   'farmer/verifyNIN',
//   async ({ farmerNationalNumber, selectedCountry }, { dispatch }) => {
//     dispatch(setFarmerNationalNumber(farmerNationalNumber))
//     dispatch(setApiCallInProgress(true))

//     const requestData = {
//       id_number: farmerNationalNumber,
//       id_type: 'national-id',
//       language: 'EN',
//       country: selectedCountry,
//       env: 'Qua',
//     }

//     try {
//       const response = await axios.post(
//         'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/iprsverification',
//         requestData
//       )

//       const res = response.data
//       const message = res?.message?.toLowerCase() || ''
//       const statusFound = res?.data?.status?.toLowerCase() === 'found'

//       if (
//         message.includes('not currently registered') ||
//         message.includes('not valid')
//       ) {
//         dispatch(setIPRSMessage(res.message))
//         dispatch(setApiCallInProgress(false))
//         dispatch(showNoIPRS(true))
//         dispatch(showModalNotFound(true))
//         return
//       }

//       if (!statusFound) {
//         dispatch(setApiCallInProgress(false))
//         dispatch(showModalNotFound(true))
//         return
//       }

//       /* ---------- FOUND ---------- */
//       dispatch(setIprsStatus(true))

//       dispatch(
//         setFarmerData({
//           firstName: res.data.firstName,
//           middleName: res.data.middleName,
//           lastName: res.data.lastName,
//           country: res.data.country,
//           dateOfBirth: res.data.dateOfBirth,
//           gender: res.data.gender,
//           idNumber: res.data.idNumber,
//           idType: res.data.identityType,
//           mainAddress: res.data.mainAddress,
//           mobileTelephoneNumber: res.data.mobileTelephoneNumber,
//           identifier: res.data.identifier,
//           signature: res.data.signature,
//         })
//       )

//       dispatch(queryDB({ farmerNationalNumber, selectedCountry }))
//     } catch (error: any) {
//       console.log('IPRS ERROR:', error?.response?.data || error.message)
//       dispatch(setApiCallInProgress(false))
//       dispatch(showNoIPRS(true))
//     }
//   }
// )

// /* -------------------- QUERY DB -------------------- */

// export const queryDB = createAsyncThunk<
//   void,
//   { farmerNationalNumber: string; selectedCountry: string },
//   { state: RootState }
// >(
//   'farmer/queryDB',
//   async ({ farmerNationalNumber, selectedCountry }, { dispatch, getState }) => {
//     const agent = getState().user.agent

//     if (!agent) {
//       dispatch(setApiCallInProgress(false))
//       dispatch(showValidNINNoAlert(true))
//       return
//     }

//     const data = {
//       farmer_national_id: farmerNationalNumber,
//       agent_id: agent.agent_id,
//       institution_id: agent.company_id,
//       country: getCountryCode(selectedCountry),
//       env: 'Qua',
//     }

//     try {
//       const response = await axios.post(
//         'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/readfarmernin',
//         data
//       )

//       const res = response.data
//       console.log(res)

//       if (res.identifier === null) {
//         dispatch(
//           setEnrollDbData({
//             identifier: 'N/A',
//             signature: 'N/A',
//           })
//         )
//         dispatch(setOperation('register'))
//         dispatch(setIprsStatus(true))
//         dispatch(showValidNINNoAlert(true))
//         dispatch(setShowModalIsValid(true))
//       } else {
//         dispatch(setEnrollDbData(res))
//         dispatch(setOperation('update'))
//         dispatch(setRecordId(res.db_data[0]._id))
//         dispatch(setIprsStatus(true))
//         dispatch(showValidNINOkAlert(true))
//       }
//     } catch (error) {
//       console.log(error)
//       dispatch(setOperation('register'))
//       dispatch(showValidNINNoAlert(true))
//     } finally {
//       dispatch(setApiCallInProgress(false))
//     }
//   }
// )

// export const queryLivestockDB = createAsyncThunk<
//   void,
//   { livestockTagNumber: string },
//   { state: RootState }
// >(
//   'livestock/queryDB',
//   async ({ livestockTagNumber }, { dispatch, getState }) => {
//     dispatch(setApiCallInProgress(true))

//     const agent = getState().user.agent

//     if (!agent) {
//       dispatch(setApiCallInProgress(false))
//       dispatch(setOperationLivestock('register'))
//       dispatch(setShowGoToRegistration(true))
//       return
//     }

//     dispatch(setLivestockTagNumber(livestockTagNumber))

//     const payload = {
//       livestock_id_number: livestockTagNumber,
//       agent_id: agent.agent_id,
//       institution_id: agent.company_id,
//       env: 'Qua',
//     }

//     try {
//       const response = await axios.post(
//         'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/readlivestocktagid',
//         payload
//       )

//       const res = response?.data
//       console.log('Livestock DB response:', res)

//       const identifier = res?.identifier

//       // 👉 Livestock NOT found → Register
//       if (!identifier) {
//         dispatch(
//           setLivestockEnrollDbData({
//             identifier: 'N/A',
//             signature: 'N/A',
//           })
//         )
//         dispatch(setOperationLivestock('register'))
//         dispatch(setShowGoToRegistration(true))
//         return
//       }

//       // 👉 Livestock EXISTS → Verify / Update
//       dispatch(setLivestockEnrollDbData(res))
//       dispatch(setOperationLivestock('update'))
//       dispatch(setShowGoToVerification(true))
//     } catch (error: any) {
//       console.error('Livestock DB error:', error)

//       const status = error?.response?.status

//       if (status === 404 || status === 501) {
//         dispatch(setOperationLivestock('register'))
//         dispatch(setShowGoToRegistration(true))
//       }
//     } finally {
//       dispatch(setApiCallInProgress(false))
//     }
//   }
// )

// /* -------------------- SLICE -------------------- */

// const farmerSlice = createSlice({
//   name: 'farmer',
//   initialState,
//   reducers: {
//     setFarmerNationalNumber(state, action: PayloadAction<string>) {
//       state.farmerNationalNumber = action.payload
//     },
//     setFarmerData(state, action: PayloadAction<FarmerIPRSData>) {
//       state.farmerData = action.payload
//     },
//     setEnrollDbData(state, action: PayloadAction<any>) {
//       state.enrollDbData = action.payload
//     },
//     setRecordId(state, action: PayloadAction<string>) {
//       state.recordId = action.payload
//     },
//     setOperation(state, action: PayloadAction<'register' | 'update'>) {
//       state.operation = action.payload
//     },
//     setApiCallInProgress(state, action: PayloadAction<boolean>) {
//       state.apiCallInProgress = action.payload
//     },
//     setIprsStatus(state, action: PayloadAction<boolean>) {
//       state.iprsStatus = action.payload
//     },
//     setIPRSMessage(state, action: PayloadAction<string>) {
//       state.iprsMessage = action.payload
//     },
//     showNoIPRS(state, action: PayloadAction<boolean>) {
//       state.showValidNINNoIPRS = action.payload
//     },
//     showValidNINNoAlert(state, action: PayloadAction<boolean>) {
//       state.showValidNINNoAlert = action.payload
//     },
//     showValidNINOkAlert(state, action: PayloadAction<boolean>) {
//       state.showValidNINOkAlert = action.payload
//     },
//     showModalNotFound(state, action: PayloadAction<boolean>) {
//       state.showModalNotFound = action.payload
//     },
//     closeShowModalNotFound(state) {
//       state.showModalNotFound = false
//     },
//     setShowModalIsValid(state, action: PayloadAction<boolean>) {
//       state.showModalValid = action.payload
//     },
//     openShowCameraComponent(state) {
//       state.showcameraComponent = true
//     },
//     closeShowCameraComponent(state) {
//       state.showcameraComponent = false
//     },
//     closeValidModal(state) {
//       state.showModalValid = false
//     },
//     OpenOperationScreen(state, action: PayloadAction<boolean>) {
//       state.openOperation = action.payload
//     },
//     closeOperationScreen(state, action: PayloadAction<boolean>) {
//       state.openOperation = action.payload
//     },
//   },
// })

// export const {
//   setFarmerNationalNumber,
//   setFarmerData,
//   setEnrollDbData,
//   setRecordId,
//   setOperation,
//   setApiCallInProgress,
//   setIprsStatus,
//   setIPRSMessage,
//   showNoIPRS,
//   showValidNINNoAlert,
//   showValidNINOkAlert,
//   showModalNotFound,
//   setShowModalIsValid,
//   closeValidModal,
//   closeShowModalNotFound,
//   openShowCameraComponent,
//   closeShowCameraComponent,
//   OpenOperationScreen,
//   closeOperationScreen,
// } = farmerSlice.actions

// export default farmerSlice.reducer

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Alert } from 'react-native'
import { RootState } from '../store/store'
import { getCountryCode } from '../utils/utils'
import { Agent } from './userSlice'
/* -------------------- TYPES -------------------- */

export interface FarmerIPRSData {
  firstName?: string
  middleName?: string
  lastName?: string
  country?: string
  dateOfBirth?: string
  gender?: string
  idNumber?: string
  idType?: string
  mainAddress?: string
  mobileTelephoneNumber?: string
  identifier?: string
  signature?: string
}

interface FarmerState {
  /* -------- FARMER -------- */
  farmerNationalNumber: string
  farmerData: FarmerIPRSData | null
  enrollDbData: any | null
  recordId: string | null
  operation: 'register' | 'update' | null
  farmerRegistrationModal: boolean
  registrationTimestamp?: string

  /* -------- LIVESTOCK -------- */
  livestockTagNumber: string
  livestockEnrollDbData: any | null
  livestockOperation: 'register' | 'update' | null
  showGoToRegistration: boolean
  showGoToVerification: boolean
  livestockRecordId: string | number | null
  registerNewLivestock: boolean
  livestockMessage: string
  livestockTagModal: boolean

  /* -------- UI -------- */
  apiCallInProgress: boolean
  iprsStatus: boolean
  iprsMessage: string | null

  showcameraComponent: boolean
  showModalNotFound: boolean
  showValidNINNoIPRS: boolean
  showValidNINNoAlert: boolean
  showValidNINOkAlert: boolean
  showModalValid: boolean
  openOperation: boolean
  error: boolean
}

/* -------------------- INITIAL STATE -------------------- */

const initialState: FarmerState = {
  /* -------- FARMER -------- */
  farmerNationalNumber: '',
  farmerData: null,
  enrollDbData: null,
  recordId: null,
  operation: null,
  farmerRegistrationModal: false,

  /* -------- LIVESTOCK -------- */
  livestockTagNumber: '',
  livestockEnrollDbData: null,
  livestockOperation: null,
  showGoToRegistration: false,
  showGoToVerification: false,
  livestockRecordId: null,
  livestockMessage: '',
  registerNewLivestock: false,
  livestockTagModal: false,
  /* -------- UI -------- */
  apiCallInProgress: false,
  iprsStatus: false,
  iprsMessage: null,

  showModalNotFound: false,
  showValidNINNoIPRS: false,
  showValidNINNoAlert: false,
  showValidNINOkAlert: false,
  showModalValid: false,
  showcameraComponent: false,
  error: false,
  openOperation: false,
}

/* -------------------- VERIFY NIN -------------------- */

export const verifyNIN = createAsyncThunk<
  void,
  { farmerNationalNumber: string; selectedCountry: string; agent: Agent },
  { state: RootState }
>(
  'farmer/verifyNIN',
  async ({ farmerNationalNumber, selectedCountry, agent }, { dispatch }) => {
    dispatch(setFarmerNationalNumber(farmerNationalNumber))
    dispatch(setApiCallInProgress(true))

    const requestData = {
      id_number: farmerNationalNumber,
      id_type: 'national-id',
      language: 'EN',
      country: selectedCountry,
      env: 'Qua',
    }

    try {
      const response = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/iprsverification',
        requestData,
      )

      const res = response.data
      const message = res?.message?.toLowerCase() || ''
      const statusFound = res?.data?.status?.toLowerCase() === 'found'

      if (
        message.includes('not currently registered') ||
        message.includes('not valid')
      ) {
        dispatch(setIPRSMessage(res.message))
        dispatch(setApiCallInProgress(false))
        dispatch(showNoIPRS(true))
        dispatch(showModalNotFound(true))

        return
      }

      if (!statusFound) {
        dispatch(setApiCallInProgress(false))
        dispatch(showModalNotFound(true))
        return
      }

      dispatch(setIprsStatus(true))

      dispatch(
        setFarmerData({
          firstName: res.data.firstName,
          middleName: res.data.middleName,
          lastName: res.data.lastName,
          country: res.data.country,
          dateOfBirth: res.data.dateOfBirth,
          gender: res.data.gender,
          idNumber: res.data.idNumber,
          idType: res.data.identityType,
          mainAddress: res.data.mainAddress,
          mobileTelephoneNumber: res.data.mobileTelephoneNumber,
          identifier: res.data.identifier,
          signature: res.data.signature,
        }),
      )

      dispatch(queryDB({ farmerNationalNumber, selectedCountry, agent }))
    } catch (error: any) {
      console.log('IPRS ERROR:', error?.response?.data || error.message)
      dispatch(setApiCallInProgress(false))
      dispatch(showNoIPRS(true))
    }
  },
)

/* -------------------- QUERY FARMER DB -------------------- */

export const queryDB = createAsyncThunk<
  void,
  { farmerNationalNumber: string; selectedCountry: string; agent: Agent },
  { state: RootState }
>(
  'farmer/queryDB',
  async ({ farmerNationalNumber, selectedCountry, agent }, { dispatch }) => {
    // const agent = getState().user.agent

    if (!agent) {
      dispatch(setApiCallInProgress(false))
      dispatch(showValidNINNoAlert(true))
      return
    }

    const data = {
      farmer_national_id: farmerNationalNumber,
      agent_id: agent.agent_id,
      institution_id: agent.company_id,
      country: getCountryCode(selectedCountry),
      env: 'Qua',
    }

    try {
      const response = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/readfarmernin',
        data,
      )

      const res = response.data

      if (res?.identifier === null) {
        dispatch(setEnrollDbData({ identifier: 'N/A', signature: 'N/A' }))
        dispatch(setOperation('register'))
        dispatch(setIprsStatus(true))
        dispatch(showValidNINNoAlert(true))
        dispatch(setShowModalIsValid(true))
      } else {
        dispatch(
          setEnrollDbData({
            identifier: res.identifier,
            signature: res.signature,
          }),
        )
        dispatch(setOperation('update'))
        dispatch(setRecordId(res?.db_data?.[0]?._id))
        dispatch(setIprsStatus(true))
        dispatch(showValidNINOkAlert(true))
      }
    } catch (error) {
      dispatch(setOperation('register'))
      dispatch(showValidNINNoAlert(true))
      console.log(error)
    } finally {
      dispatch(setApiCallInProgress(false))
    }
  },
)

/* -------------------- QUERY LIVESTOCK DB -------------------- */

export const queryLivestockDB = createAsyncThunk<
  void,
  { livestockTagNumber: string; agent: Agent },
  { state: RootState }
>('livestock/queryDB', async ({ livestockTagNumber, agent }, { dispatch }) => {
  dispatch(setApiCallInProgress(true))

  // const agent = getState().user.agent
  console.log('Sending Livestock tag number')

  try {
    if (!agent) {
      dispatch(setApiCallInProgress(false))
      dispatch(setOperationLivestock('register'))

      return
    }

    dispatch(setLivestockTagNumber(livestockTagNumber))

    const payload = {
      livestock_id_number: livestockTagNumber,
      agent_id: agent.agent_id,
      institution_id: agent.company_id,
      env: 'Qua',
    }
    const response = await axios.post(
      'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/readlivestocktagid',
      payload,
    )

    const res = response?.data
    console.log(res)

    if (res.identifier === null) {
      dispatch(
        setLivestockEnrollDbData({ identifier: 'N/A', signature: 'N/A' }),
      )
      dispatch(
        setLivestockMessage(
          'This Livestock Tag Identification Number is not currently registered. Please proceed to registration process.',
        ),
      )
      dispatch(setOperationLivestock('register'))
      // dispatch(setShowGoToRegistration(true))
      dispatch(setShowLivestockTagModal(true))
      return
    }

    dispatch(setShowLivestockTagModal(true))
    dispatch(setLivestockEnrollDbData(res))
    dispatch(setOperationLivestock('update'))
    dispatch(setShowGoToVerification(true))
  } catch (error: any) {
    const status = error?.response?.status
    if (status === 404 || status === 501) {
      dispatch(setOperationLivestock('register'))
      Alert.alert(error)
      // dispatch(setShowGoToRegistration(true))
    }
  } finally {
    dispatch(setApiCallInProgress(false))
  }
})

/* -------------------- SLICE -------------------- */

const farmerSlice = createSlice({
  name: 'farmer',
  initialState,
  reducers: {
    setFarmerNationalNumber(state, action: PayloadAction<string>) {
      state.farmerNationalNumber = action.payload
    },
    setFarmerData(state, action: PayloadAction<FarmerIPRSData>) {
      state.farmerData = action.payload
    },
    setEnrollDbData(state, action: PayloadAction<any>) {
      state.enrollDbData = action.payload
    },
    setRecordId(state, action: PayloadAction<string>) {
      state.recordId = action.payload
    },
    setOperation(state, action: PayloadAction<'register' | 'update'>) {
      state.operation = action.payload
    },

    /* ---------- LIVESTOCK ---------- */
    setLivestockTagNumber(state, action: PayloadAction<string>) {
      state.livestockTagNumber = action.payload
    },
    setLivestockEnrollDbData(state, action: PayloadAction<any>) {
      state.livestockEnrollDbData = action.payload
    },
    setOperationLivestock(state, action: PayloadAction<'register' | 'update'>) {
      state.livestockOperation = action.payload
    },
    setShowGoToRegistration(state, action: PayloadAction<boolean>) {
      state.showGoToRegistration = action.payload
      state.showGoToVerification = false
    },
    setShowGoToVerification(state, action: PayloadAction<boolean>) {
      state.showGoToVerification = action.payload
      state.showGoToRegistration = false
    },

    setCloseGotoRegistration(state, action: PayloadAction<boolean>) {
      state.showGoToRegistration = action.payload
    },
    setCloseGotoVerification(state, action: PayloadAction<boolean>) {
      state.showGoToVerification = action.payload
    },

    /* ---------- UI ---------- */
    setApiCallInProgress(state, action: PayloadAction<boolean>) {
      state.apiCallInProgress = action.payload
    },
    setIprsStatus(state, action: PayloadAction<boolean>) {
      state.iprsStatus = action.payload
    },
    setIPRSMessage(state, action: PayloadAction<string>) {
      state.iprsMessage = action.payload
    },
    showNoIPRS(state, action: PayloadAction<boolean>) {
      state.showValidNINNoIPRS = action.payload
    },
    showValidNINNoAlert(state, action: PayloadAction<boolean>) {
      state.showValidNINNoAlert = action.payload
    },
    showValidNINOkAlert(state, action: PayloadAction<boolean>) {
      state.showValidNINOkAlert = action.payload
    },
    showModalNotFound(state, action: PayloadAction<boolean>) {
      state.showModalNotFound = action.payload
    },
    closeShowModalNotFound(state) {
      state.showModalNotFound = false
    },
    setShowModalIsValid(state, action: PayloadAction<boolean>) {
      state.showModalValid = action.payload
    },
    openShowCameraComponent(state) {
      state.showcameraComponent = true
    },
    closeShowCameraComponent(state) {
      state.showcameraComponent = false
    },
    closeValidModal(state) {
      state.showModalValid = false
    },
    OpenOperationScreen(state, action: PayloadAction<boolean>) {
      state.openOperation = action.payload
    },
    closeOperationScreen(state, action: PayloadAction<boolean>) {
      state.openOperation = action.payload
    },
    setRecordIdLivestock(state, action: PayloadAction<string | number>) {
      state.livestockRecordId = action.payload
    },
    setLivestockMessage(state, action: PayloadAction<string>) {
      state.livestockMessage = action.payload
    },
    setRegisterNewLivestock(state, action: PayloadAction<boolean>) {
      state.registerNewLivestock = action.payload
    },
    setCloseRegisterNewLivestock(state, action: PayloadAction<boolean>) {
      state.registerNewLivestock = action.payload
    },
    setShowLivestockTagModal(state, action: PayloadAction<boolean>) {
      state.livestockTagModal = action.payload
    },
    setCloseLivestockModal(state, action: PayloadAction<boolean>) {
      state.livestockTagModal = action.payload
    },
    setShowFarmerRegistrationModal(state, action: PayloadAction<boolean>) {
      state.farmerRegistrationModal = action.payload
    },
    setCloseFarmerRegistrationModal(state, action: PayloadAction<boolean>) {
      state.farmerRegistrationModal = action.payload
    },
    setRegistrationTimestamp(state, action: PayloadAction<string>) {
      state.registrationTimestamp = action.payload
    },
  },
})

export const {
  setFarmerNationalNumber,
  setFarmerData,
  setEnrollDbData,
  setRecordId,
  setOperation,

  setLivestockTagNumber,
  setLivestockEnrollDbData,
  setOperationLivestock,
  setShowGoToRegistration,
  setShowGoToVerification,

  setApiCallInProgress,
  setIprsStatus,
  setIPRSMessage,
  showNoIPRS,
  showValidNINNoAlert,
  showValidNINOkAlert,
  showModalNotFound,
  setShowModalIsValid,
  closeValidModal,
  closeShowModalNotFound,
  openShowCameraComponent,
  closeShowCameraComponent,
  OpenOperationScreen,
  closeOperationScreen,
  setRecordIdLivestock,
  setLivestockMessage,
  setRegisterNewLivestock,
  setCloseRegisterNewLivestock,
  setCloseLivestockModal,
  setShowLivestockTagModal,
  setCloseFarmerRegistrationModal,
  setShowFarmerRegistrationModal,
  setCloseGotoRegistration,
  setRegistrationTimestamp,
} = farmerSlice.actions

export default farmerSlice.reducer

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store/store'
import { getCountryCode } from '../utils/utils'

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
}

interface FarmerState {
  farmerNationalNumber: string
  farmerData: FarmerIPRSData | null
  enrollDbData: any | null
  recordId: string | null
  operation: 'register' | 'update' | null

  apiCallInProgress: boolean
  iprsStatus: boolean
  iprsMessage: string | null
  showModalNotFound: boolean
  showValidNINNoIPRS: boolean
  showValidNINNoAlert: boolean
  showValidNINOkAlert: boolean
  showModalValid: boolean
  error: boolean
}

const initialState: FarmerState = {
  farmerNationalNumber: '',
  farmerData: null,
  enrollDbData: null,
  recordId: null,
  operation: null,

  apiCallInProgress: false,
  iprsStatus: false,
  iprsMessage: null,
  showModalValid: false,

  showValidNINNoIPRS: false,
  showValidNINNoAlert: false,
  showValidNINOkAlert: false,
  showModalNotFound: false,

  error: false,
}

export const verifyNIN = createAsyncThunk<
  void,
  { farmerNationalNumber: string; selectedCountry: string },
  { state: RootState }
>(
  'farmer/verifyNIN',
  async ({ farmerNationalNumber, selectedCountry }, thunkAPI) => {
    const { dispatch } = thunkAPI
    // const { agent } = getState().user

    dispatch(setFarmerNationalNumber(farmerNationalNumber))
    dispatch(setApiCallInProgress(true))

    const requestData = {
      id_number: farmerNationalNumber,
      id_type: 'national-id',
      language: 'EN',
      country: selectedCountry,
      env: 'Qua',
    }

    console.log('Verifying')

    try {
      const response = await axios.post(
        'https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/iprsverification',
        requestData
      )

      console.log('Verification complete')

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
        dispatch(showModalNotFound(true))
        dispatch(setApiCallInProgress(false))
        return
      }

      // FOUND
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
        })
      )

      // 🔁 CALL QUERY DB
      dispatch(queryDB({ farmerNationalNumber, selectedCountry }))
    } catch (error) {
      console.log('IPRS ERROR:', error)
      console.log('IPRS ERROR MESSAGE:', error?.message)
      console.log('IPRS ERROR RESPONSE:', error?.response?.data)
    }
  }
)

export const queryDB = createAsyncThunk<
  void,
  { farmerNationalNumber: string; selectedCountry: string },
  { state: RootState }
>(
  'farmer/queryDB',
  async ({ farmerNationalNumber, selectedCountry }, { dispatch, getState }) => {
    const { agent } = getState().user
    console.log(agent)

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
        data
      )

      const res = response.data
      console.log(res)

      if (res.identifier === null) {
        dispatch(
          setEnrollDbData({
            identifier: 'N/A',
            signature: 'N/A',
          })
        )
        dispatch(setOperation('register'))
        dispatch(setIprsStatus(true))
        dispatch(showNoAlert(true))
        dispatch(setShowModalIsValid(true))
      } else {
        dispatch(setEnrollDbData(res))
        dispatch(setOperation('update'))
        dispatch(setRecordId(res.db_data[0]._id))
        dispatch(setIprsStatus(true))
        dispatch(showOkAlert(true))
      }
    } catch (error) {
      dispatch(setOperation('register'))
      dispatch(showNoAlert(true))
      console.log(error)
    } finally {
      dispatch(setApiCallInProgress(false))
    }
  }
)
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
    showNoAlert(state, action: PayloadAction<boolean>) {
      state.showValidNINNoAlert = action.payload
    },
    showOkAlert(state, action: PayloadAction<boolean>) {
      state.showValidNINOkAlert = action.payload
    },
    showModalNotFound(state, action: PayloadAction<boolean>) {
      state.showModalNotFound = action.payload
    },
    closeShowModalNotFound(state) {
      state.showModalNotFound = false
    },
    setShowModalIsValid(state, action) {
      state.showModalValid = action.payload
    },
    closeValidModal(state) {
      state.showModalValid = false
    },
  },
})

export const {
  setFarmerNationalNumber,
  setFarmerData,
  setEnrollDbData,
  setRecordId,
  setOperation,
  setApiCallInProgress,
  setIprsStatus,
  setIPRSMessage,
  showNoIPRS,
  showNoAlert,
  showOkAlert,
  closeShowModalNotFound,
  showModalNotFound,
  setShowModalIsValid,
  closeValidModal,
} = farmerSlice.actions

export default farmerSlice.reducer

import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCompanyData, handleLoginAPI } from '../Hooks/Api/Auth/HandleLogin'

GoogleSignin.configure({
  webClientId:
    '316918224988-1nq9g2r87tcj81eh65bra7pr426vqr55.apps.googleusercontent.com',
  iosClientId:
    '316918224988-d1565quphs7un213n3c2sqlbg96jq4cn.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
})

export interface Agent {
  company_id: string
  institutions: string[]
  mic_email_id: string
  mic_name: string
  name: string
  national_id: string
  registration_number: string
  role: string
  status: boolean
  agent_id: string
  image: string
}

export interface CompanyData {
  email: string
  company_logo: string
  compamy_email_id: string
  linked_insurance_companies: string[]
}

interface UserState {
  agent: Agent
  companyData: CompanyData
  loading: boolean
  signingIn: boolean
  error: string | null
  successMsg: string | null
  errorMsg: string | null
  signInModal: boolean
}

const initialState: UserState = {
  agent: {
    company_id: '',
    institutions: [],
    mic_email_id: '',
    mic_name: '',
    name: '',
    national_id: '',
    registration_number: '',
    role: '',
    status: false,
    agent_id: '',
    image: '',
  },
  companyData: {
    email: '',
    company_logo: '',
    compamy_email_id: '',
    linked_insurance_companies: [],
  },
  loading: false,
  signingIn: false,
  error: null,
  successMsg: null,
  errorMsg: null,
  signInModal: false,
}

// Thunk
//Sign In With Google
export const signInWithGoogle = createAsyncThunk<
  { agent: Agent; companyData: CompanyData },
  void,
  { rejectValue: string }
>('user/signInWithGoogle', async (_, { rejectWithValue }) => {
  try {
    await GoogleSignin.hasPlayServices()
    const result = await GoogleSignin.signIn()
    const profile = result.data.user || result.data?.user
    if (!profile) throw new Error('Google profile not found')

    const userData = {
      email: profile.email,
      name: profile.name,
      google_id: profile.id,
      image: profile.photo ?? '',
    }

    const userDetails = await handleLoginAPI(userData.email)
    if (!userDetails.status) {
      return rejectWithValue('Your account is not approved.')
    }

    const companyData = await getCompanyData(
      userDetails.institutions[0],
      userDetails.user_id,
      userDetails.company_id
    )

    return {
      agent: {
        company_id: userDetails.company_id,
        institutions: userDetails.institutions,
        mic_email_id: userDetails.mic_email_id,
        name: userDetails.name,
        national_id: userDetails.national_id,
        mic_name: userDetails.mic_name,
        registration_number: userDetails.registration_number,
        role: userDetails.role,
        status: userDetails.status,
        agent_id: userDetails.user_id,
        image: userData.image,
      },
      companyData: {
        email: companyData.email,
        company_logo: companyData.company_logo,
        compamy_email_id: companyData.compamy_email_id,
        linked_insurance_companies: companyData.linked_insurance_companies,
      },
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Google login failed')
  }
})

//Sign-Out
export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await GoogleSignin.signOut()
      // No return value needed, we just clear state
    } catch (error: any) {
      console.log('Google logout error:', error)
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState(state) {
      state.agent = initialState.agent
      state.companyData = initialState.companyData
      state.loading = false
      state.signingIn = false
      state.error = null
      state.successMsg = null
      state.errorMsg = null
    },
    removeSignInModal(state) {
      state.signInModal = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true
        state.signingIn = true
        state.error = null
        state.successMsg = null
      })
      .addCase(
        signInWithGoogle.fulfilled,
        (
          state,
          action: PayloadAction<{ agent: Agent; companyData: CompanyData }>
        ) => {
          state.loading = false
          state.signingIn = false
          state.agent = action.payload.agent
          state.companyData = action.payload.companyData
          state.successMsg = 'Login successful'
          state.signInModal = true
          console.log(state.agent)
        }
      )
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.signingIn = false
        state.error = action.payload || 'Login failed'
        state.errorMsg = action.payload || 'Login failed'
      })
      .addCase(signOut.fulfilled, (state) => {
        // clear everything when logout succeeds
        state.agent = initialState.agent
        state.companyData = initialState.companyData
        state.loading = false
        state.signingIn = false
        state.signInModal = false
        state.error = null
        state.successMsg = null
        state.errorMsg = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload || 'Logout failed'
        state.errorMsg = action.payload || 'Logout failed'
      })
  },
})

export const { clearUserState, removeSignInModal } = userSlice.actions
export default userSlice.reducer

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useState } from "react";
import { Alert } from "react-native";
import { getCompanyData, handleLoginAPI } from "../Hooks/Api/Auth/HandleLogin";


// ---------------------------
// Context
// ---------------------------
export const UserContext = createContext<any>(null);

// ---------------------------
// Google Sign-In config
// ---------------------------
GoogleSignin.configure({
  webClientId: "316918224988-1nq9g2r87tcj81eh65bra7pr426vqr55.apps.googleusercontent.com",
  iosClientId: "316918224988-d1565quphs7un213n3c2sqlbg96jq4cn.apps.googleusercontent.com",
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

// ---------------------------
// User Provider
// ---------------------------
export const Userprovider = ({ children }: { children: React.ReactNode }) => {

  const db = useSQLiteContext();
  const router = useRouter();
const [user, setUser] = useState({
  company_id: "",
  institutions: [],
  mic_email_id: "",
  mic_name: "",
  name: "",
  national_id: "",
  registration_number: "",
  role: "",
  status: false,
  user_id: "",
  image: ""
});

const [companyData, setCompanyData] = useState({
  email: "",
  company_logo:"",
  compamy_email_id:"",
  linked_insurance_companies:[],
})
  const [loading, setLoading] = useState(false);
  const [loadingVerifyNiN,setLoadingVerifyNiN] = useState(false)
const [registerNewLivestock, setRegisterNewLivestock] = useState(false)
const [step, setStep] = useState<number>(1);
 

  // ---------------------------
 
  // ---------------------------
  // Logout
  // ---------------------------
  const logout = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      console.log("Google logout error:", e);
    }

    await db.runAsync("DELETE FROM session;");
    setUser(null);
    Alert.alert("Logged out", "You have been logged out.");
    router.replace("/");
  };

  // ---------------------------
  // Google Sign-In
  // ---------------------------
  const [signingIn, setSigningIn] = useState(false);


  //Handle Google Sign-In
  const handleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);

    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      setLoading(true)
      const profile = result.data.user;
      const userData = {
        email: profile.email,
        name: profile.name,
        google_id: profile.id,
        role: "field_officer",
        image: profile.photo ?? "",
      };
      const userDetails = await handleLoginAPI(userData.email);  // Call the login API
      if (!userDetails.status) {
        Alert.alert("Login Failed", "Your account is not approved.");
        setSigningIn(false);
        return;
      }
      setUser({
        company_id: userDetails.company_id,
        institutions: userDetails.institutions,
        mic_email_id: userDetails.mic_email_id,
        name: userDetails.name,
        national_id: userDetails.national_id,
        mic_name: userDetails.mic_name,
        registration_number: userDetails.registration_number,
        role: userDetails.role,
        status: userDetails.status,
        user_id: userDetails.user_id,
        image: userData.image
      })
      // console.log(userDetails);
      
     // setUser(userData);

      Alert.alert("Welcome!", profile.name);
      router.replace("/FillForm");
      // console.log(userDetails.institutions[0],userDetails.user_id,userDetails.company_id);
      
      fetchCompanyData(userDetails.institutions[0],userDetails.user_id,userDetails.company_id);
      setLoading(false)
    } catch (e) {
      console.log("Google Sign-In error:", e);
      Alert.alert("Login error", "Google login failed");
      setLoading(false)
    } finally {
      setSigningIn(false);
    }
  };

  //Get company data function
const fetchCompanyData = async(institution:string,agent_id:string,instituition_id:string)=>{
  try {
    const companyData = await getCompanyData(institution,agent_id,instituition_id); 
  setCompanyData({
    email:companyData.company_email_id,
    company_logo:companyData.company_logo,
    compamy_email_id:companyData.compamy_email_id,
    linked_insurance_companies:companyData.linked_insurance_companies,
  })
  //image is in base64 format dont forget to decode it when displaying

  // console.log(companyData);
  
  } catch (error) {
    console.log("Error fetching company data:", error);
  }}

//Get country code function
const getCountryCode = (country) => {
    const countryMap = {
      'Kenya': 'KE',
      'Democratic Republic of Congo': 'COD',
      'Belgium': 'BE',
      'Tanzania': 'TZ',
      'Zambia': 'ZM',
      'India': 'IN',
    };
    return countryMap[country] || '';
  };

const verify_nin = async(farmerNationalId,selectedCountry) => {
    // dispatch({ type: 'SET_FARMER_NATIONAL_NUMBER', payload: farmerNationalNumber });
    // setApiCallInProgress(true);
 
    const requestData = {
      id_number: farmerNationalId,
      id_type: 'national-id',
      language: 'EN',
      country: getCountryCode(selectedCountry),
      env: 'Qua',
    };
    console.log(requestData);
    

    try {
      setLoadingVerifyNiN(true)
      const response = await axios.post("https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/iprsverification", requestData)
       const res = response.data;
       console.log(res);
       
       //const message = res?.message?.toLowerCase() || "";
       //const statusFound = res?.data?.status?.toLowerCase() === "found";
      
  
         // If found
         // setIprsStatus(true);
         // Extract and dispatch farmer data from IPRS
        //  const farmerData = {
        //    firstName: res.data.firstName,
        //    middleName: res.data.middleName,
        //    lastName: res.data.lastName,
        //    country: res.data.country,
        //    dateOfBirth: res.data.dateOfBirth,
        //    gender: res.data.gender,
        //    idNumber: res.data.idNumber,
        //    idType: res.data.identityType,
        //    mainAddress: res.data.mainAddress,
        //    mobileTelephoneNumber: res.data.mobileTelephoneNumber,
        //  };
         // dispatch({ type: 'SET_FARMER_DATA', payload: farmerData });
  
          const resp = await query_db(farmerNationalId,selectedCountry);
          setLoadingVerifyNiN(false)
    } catch (error) {
      console.log("There was an error",error);
      setLoadingVerifyNiN(false)
      
    }
 
      
      
  };


  const query_db = async(farmerNationalId,selectedCountry) => {
    const data = {
      farmer_national_id: farmerNationalId,
      agent_id: user.user_id,
      institution_id:user.company_id,
      country: getCountryCode(selectedCountry),
      env: 'Qua',
    };

    try {
      
      const response = await axios
        .post("https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/readfarmernin", data)
      const responseData = response.data;
      console.log("Database Response:", responseData);
      return responseData;  
    } catch (error) {
      console.log(error);
      
    }
  };



//Verify NIN function

  

  // ---------------------------
  // Load session on startup
  // ---------------------------

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        handleSignIn,
        logout,
        setUser,
        verify_nin,
        loadingVerifyNiN,
        query_db,
        setLoadingVerifyNiN,
        registerNewLivestock,
        setRegisterNewLivestock, 
        step,setStep
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

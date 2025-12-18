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
const [agent, setAgent] = useState({
  company_id: "",
  institutions: [],
  mic_email_id: "",
  mic_name: "",
  name: "",
  national_id: "",
  registration_number: "",
  role: "",
  status: false,
  agent_id: "",
  image: ""
});


const [farmerData, setFarmerData] = useState({
  firstName: "",
  middleName: "",
  lastName: "",
  country: "",
  dateOfBirth: "",
  gender: "",
  idNumber: "",
  idType: "",
  mainAddress: "",
  mobileTelephoneNumber: "",
  signature:'',
  id:""
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
const [showTagNameInput,setShowTagName] = useState(false)
const [operation,setoperation] = useState("register")
const [record,setRecord]=useState()
const [box, setBox] = useState([
     40,
    40,
     240,
     240,
  ]);
 

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

    
    setAgent(null);
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
      setAgent({
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


const handleFarmerForm =async(apidata)=>{
    let updatedSubmitJsonData ={}
    updatedSubmitJsonData= Object.assign(
        {},apidata
    )
    let data ={
        record:updatedSubmitJsonData,
        record_id:record,
        env:"Qua",
        operation:operation,
        uuid:farmerData.id ||"",
        agent_id:agent.agent_id,
        institution_id:agent.company_id
    }
    try {
      
      const response = await axios.post("https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/updatefarmer",data)
  
      const res =response.data
      console.log(res);
      if(res.success){
          Alert.alert("Successfully registered")
      }
    } catch (error) {
      console.log("There was an error",error);
      
    }
    
}


const registerLivestockTag = async(livestockTagNumber)=>{

    let data = {
        livestock_id_number:livestockTagNumber,
        agent_id:agent.agent_id,
        institution_id:agent.company_id,
        env:"Qua"
    }
    const res = await axios.post('https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/realivestocktagis', data)
    const response = res.data
    if(response.identifier === null){
        let res ={
            identifier:'N/A',
            signature:'N/A'
        }
        console.log(response);
        //save it in state

    }
    else{
        //write verification re-direct code here

    }
}



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
       
      const message = res?.message?.toLowerCase() || "";
       const statusFound = res?.data?.status?.toLowerCase() === "found";
      
  if(statusFound){
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
  signature:res.data.signature,
  id:res.data.identifier
});
  }
         
         
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
      agent_id: agent.agent_id,
      institution_id:agent.company_id,
      country: getCountryCode(selectedCountry),
      env: 'Qua',
    };

    try {
      
      const response = await axios
        .post("https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/readfarmernin", data)
      const responseData = response.data;
      console.log("Database Response:", responseData);
      setRecord(responseData.db_data[0].id)
      return responseData;  
    } catch (error) {
      console.log(error);
      
    }
  };



//CallPerformanceMetrics
const callPerformanceMetrics = async (type, response) => {
    try {
        const payload = {
        record: {
            agent_id: agent.agent_id,
            institution_id: agent.company_id,
            request_source: "Halisi_V1.0",
            API_function: type === "verify" ? "VerifyFarmer" : "EnrollFarmer",
            API_verification_result: type === "verify" ? response.match : null,
            Manual_verification_result: null,
            timeStamp: response.timestamp,
            API_verification_score: response.score ?? null,
            API_Deduplication_result: type === "enroll" ? response.dedup_result : null,
            API_Deduplication_score: type === "enroll" ? response.dedup_score : null,
        },
        env: "Qua",
      };

      await axios.post(
        "https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/getperformancemetrics",
        payload
      );
    } catch (err) {
      console.error("Error fetching performance metrics:", err);
    }
    };



    //CallPerformanceMetricsLivestock
    const callPerformanceMetricsForLivestock  = async(type,response)=>{
    try {
        const payload ={
            record:{
                agent_id:agent.agent_id,
                insitution_id:agent.company_id,
                request_source:"Halisi_v1.0",
                API_function:type ==="verify"?"verifyLivestock":"EnrollLivetock",
                Manual_verificaton:null,
                timeStamp:response.timestamp,
                API_verification_score:response.score??null,
                API_Deduplication_result:type === "enroll"? response.dedupresult:null,
                API_Deduplication_score:type ==="enroll"? Number(response.dedup_score):null,
            },
            env:"Qua",
        }
        const resp = await axios.post ('https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/getPerformancemetrics',payload)
        console.log(resp);
        
    } catch (error) {
        console.log("");
        
    }
}
//write to DB
     const writeToRecord = (apidata,operation) => {
        let updatedSubmitJsonData = {};

        updatedSubmitJsonData = Object.assign({}, apidata, {
        consent: true,
        agent_name: agent.name ?? "",
        agent_institution: agent.institutions[0] ?? "",
        agent_email: agent?.mic_email_id ?? "",
        agent_verified_email: agent?.mic_email_id ?? false,
        agent_id: agent.agent_id ?? "",
        institution_id: agent.company_id ?? "",

        // Conditionally add fields:
        ...(operation === "register" && agent.role === "field_officer"
            ? {
                agent_id_registration: agent.agent_id ?? "",
                agent_name_registration: agent?.name ?? "",
                agent_institution_registration: agent.institutions[0] ?? "",
                agent_email_registration: agent.mic_email_id ?? "",
                agent_verified_email_registration: agent?.mic_email_id ?? false,
                agent_institution_id_registration: agent.company_id ?? ""
            }
            : {}),

        ...(operation === "update" && agent.role === "field_officer"
            ? {
                agent_id_request: agent.agent_id ?? "",
                agent_name_request: agent?.name ?? "",
                agent_institution_request: agent.institutions[0] ?? "",
                agent_email_request: agent?.mic_email_id ?? "",
                agent_verified_email_request: agent?.mic_email_id ?? false,
                agent_institution_id_request: agent.company_id ?? ""
            }
            : {}),

        ...(operation === "update" && agent.role === "veterinarian"
            ? {
                veterinarian_id: agent.agent_id ?? "",
                veterinarian_name_request: agent?.name ?? "",
                veterinarian_institution_request: agent.institutions[0] ?? "",
                veterinarian_email_request: agent?.mic_email_id ?? "",
                veterinarian_verified_email_request: agent?.mic_email_id ?? false,
                veterinarian_institution_id_request: agent.company_id ?? ""
            }
            : {})
        });
        let data = {
            record: updatedSubmitJsonData,
            env: 'Qua'
        };

        axios
        .post(
            "https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/createfarmer",

            data,
            { timeout: 20000 }
        )
        .then((data) => {
            let res = data.data;
            if (res.success) {
                // dispatch({ type: 'SET_RECORD_ID', payload:res.record_id});
                setRecord(res.record_id)
            } else {
                // setRecheckMessage(true);
            }
        });
    };

  

  // ---------------------------
  // Load session on startup
  // ---------------------------

  return (
    <UserContext.Provider
      value={{
        agent,
        loading,
        handleSignIn,
        logout,
        setAgent,
        verify_nin,
        loadingVerifyNiN,
        query_db,
        setLoadingVerifyNiN,
        registerNewLivestock,
        setRegisterNewLivestock, 
        step,setStep,showTagNameInput,setShowTagName,callPerformanceMetrics, 
        farmerData,setFarmerData,
        writeToRecord,
        box,setBox,operation,
        handleFarmerForm,
        callPerformanceMetricsForLivestock,
        registerLivestockTag
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

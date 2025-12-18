import axios from "axios"
import { Alert } from "react-native"

const handleFarmerForm =async(apidata)=>{
    let updatedSubmitJsonData ={}
    updatedSubmitJsonData= Object.assign(
        {},apidata
    )
    let data ={
        record:updatedSubmitJsonData,
        record_id:record_id,
        env:"Qua",
        operation:operation,
        uuid:farmerData.identifier ||"",
        agent_id:agent_id,
        institution_id:institution_id
    }
    const response = await axios.post("https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/updatefarmer",data)

    const res =response.data
    console.log(res);
    if(res.success){
        Alert.alert("Successfully registered")
    }
    else{
        Alert.alert("There was an error")
    }

    
}


const registerLivestock = async()=>{

    let data = {
        livestock_id_number:livestockTagNumber,
        agent_id:agent.agent_id,
        institution_id:institution_id,
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
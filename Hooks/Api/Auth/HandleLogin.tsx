import axios from 'axios';

export const handleLoginAPI = async(email)=>{
    try{
const response = await axios.post('https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/verifyuseremailid', { email_id:email,env:"Qua" });
//set is Approved to true if login is successful
const res = response.data;
// console.log(res);
return res;


    }
    catch(error){
        console.error("Login API Error: ", error);
        throw error;
    }
}

export const getCompanyData = async(institution:string,agent_id:string,instituition_id:string)=>{
    let data ={
institution:institution,
agent_id:agent_id,
institution_id:instituition_id,
env:"Qua"
    }

    try {
        const response =await axios.post('https://hal-liv-qua-san-fnapp-v1.azurewebsites.net/api/getCompanyinformation',data)
        const res = response.data;
        // console.log(res);
        return res;
        
    } catch (error) {
        console.log("Error Something went wrong while fetching company data",error );
        
    }
}
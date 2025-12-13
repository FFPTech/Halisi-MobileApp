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
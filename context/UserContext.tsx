import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useState } from "react";
import { Alert } from "react-native";
import { handleLoginAPI } from "../Hooks/Api/Auth/HandleLogin";


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
  const [loading, setLoading] = useState(true);

  


 

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

  const handleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);

    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

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
      console.log(userDetails);
      
     // setUser(userData);

      Alert.alert("Welcome!", profile.name);
      router.replace("/FillForm");
    } catch (e) {
      console.log("Google Sign-In error:", e);
      Alert.alert("Login error", "Google login failed");
    } finally {
      setSigningIn(false);
    }
  };

  

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
        
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

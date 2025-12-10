import React, { useEffect } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { users } from "../data/user";
import { loadUsersFromStorage, saveUsersToStorage } from "../storage/storeUsers";


import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import CommonButton from "../components/CommonButtonComponent";
import InputComponent from "../components/InputComponent";
import { useUser } from "../Hooks/useUserGlobal";






export default function index() {

const {handleSignIn,email,setEmail,password,setPassword,user,setUser} = useUser();
  
const router = useRouter();

  // const clearAllData = async () => {
  // try {
  //   await AsyncStorage.clear();
  //   console.log("All local data cleared successfully!");
  // } catch (error) {
  //   console.error(" Error clearing AsyncStorage:", error);
  // }}

  //  Load or initialize users
  useEffect(() => {
    (async () => {
      const existingUsers = await loadUsersFromStorage();
      if (!existingUsers) {
        console.log("🚀 No users found — saving to local storage...");
        await saveUsersToStorage(users);
      }
      const savedUsers = await loadUsersFromStorage();
      // console.log(" Users currently in AsyncStorage:", savedUsers);
    })();
  }, []);

  //  Handle Login
  



  
  return (
    <SafeAreaView style={styles.wrapper}>  
     <StatusBar  backgroundColor="#2e7d32" />

    <View style={styles.container}>
      <Image source={require('../assets/images/halisi-logo.png')} style={styles.logo} resizeMode="contain" />

      <InputComponent
        label="email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <InputComponent
        label="password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <CommonButton title="Login" onPress={()=>router.replace("/FillForm")} />
      </View>
      <View>

        <GoogleSigninButton size={GoogleSigninButton.Size.Wide}  color={GoogleSigninButton.Color.Light} style={{width:212,height:48}} onPress={handleSignIn}/>
      </View>
    </View>
    </SafeAreaView>
  );
}

//Emulator SHA-1 fingerprint:
//5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

//Physical Device SHA-1 fingerprint:
// 87:C9:44:73:0F:0D:5E:B5:BC:E6:72:CD:24:C6:B5:07:C1:D2:ED:5F
const styles = StyleSheet.create({ 

  wrapper:{
    flex:1,
    backgroundColor: "#eee",
  },
  container: {
    paddingTop:70,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
});

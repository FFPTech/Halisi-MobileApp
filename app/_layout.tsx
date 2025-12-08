import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Userprovider } from "../context/UserContext";


export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="halisi">

    
    <Userprovider>
    <SafeAreaProvider>
  <Stack screenOptions={{
    headerShown:false
  }}/>
    </SafeAreaProvider>
    </Userprovider>
    </SQLiteProvider>
  )
  
    
    
    
}

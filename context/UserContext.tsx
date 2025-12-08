import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

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

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Init database + tables
  // ---------------------------
  const initDB = async () => {
    await db.execAsync(`
      PRAGMA foreign_keys = OFF;

      DROP TABLE IF EXISTS livestock;
      DROP TABLE IF EXISTS farmers;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS session;

      PRAGMA foreign_keys = ON;

      CREATE TABLE users (
        email TEXT PRIMARY KEY,
        name TEXT,
        role TEXT,
        google_id TEXT UNIQUE,
        image TEXT,
        data TEXT
      );

      CREATE TABLE session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT
      );

      CREATE TABLE farmers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farmer_firstname TEXT,
        farmer_surname TEXT,
        farmer_national_id TEXT UNIQUE,   -- 🔥 Unique Key
        farmer_county TEXT,
        farmer_mobile_number TEXT,
        farmer_monthly_income TEXT,
        farmer_experience TEXT,
        farmer_gender TEXT,
        farmer_age_category TEXT,
        farmer_schooling TEXT,
        farmer_place_of_living TEXT,
        farmer_residential_status TEXT,
        farmer_type_of_customer TEXT,
        farmer_annual_income TEXT,
        farmer_country TEXT,
        farmer_email TEXT,
        farmer_verified INTEGER,
        agent_id TEXT,
        FOREIGN KEY(agent_id) REFERENCES users(google_id)
      );

      CREATE TABLE livestock (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        livestock_tag TEXT,
        photo_uri TEXT,
        farmer_id TEXT,                       -- 🔥 now TEXT instead of INTEGER
        FOREIGN KEY(farmer_id) REFERENCES farmers(farmer_national_id)
      );
    `);
  };

  // ---------------------------
  // Load saved session
  // ---------------------------
  const loadSession = async () => {
    const session = await db.getFirstAsync<{ email: string }>(
      "SELECT email FROM session"
    );

    if (!session) return null;

    const row = await db.getFirstAsync<{ data: string }>(
      "SELECT data FROM users WHERE email = ?",
      [session.email]
    );

    return row ? JSON.parse(row.data) : null;
  };

  // ---------------------------
  // Save user + session
  // ---------------------------
  const saveUser = async (userData: any) => {
    await db.runAsync(
      `INSERT OR REPLACE INTO users (email, name, role, google_id, image, data)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        userData.email,
        userData.name,
        userData.role ?? "",
        userData.google_id ?? "",
        userData.image ?? "",
        JSON.stringify(userData),
      ]
    );

    await db.runAsync("DELETE FROM session;");
    await db.runAsync("INSERT INTO session (email) VALUES (?);", [
      userData.email,
    ]);
  };

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

      await saveUser(userData);
      setUser(userData);

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
  // Save Farmer
  // ---------------------------
  const saveFarmer = async (farmerData: any) => {
    if (!user?.google_id) throw new Error("No agent logged in");

    await db.runAsync(
      `INSERT INTO farmers (
        farmer_firstname,
        farmer_surname,
        farmer_national_id,
        farmer_county,
        farmer_mobile_number,
        farmer_monthly_income,
        farmer_experience,
        farmer_gender,
        farmer_age_category,
        farmer_schooling,
        farmer_place_of_living,
        farmer_residential_status,
        farmer_type_of_customer,
        farmer_annual_income,
        farmer_country,
        farmer_verified,
        agent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        farmerData.firstName,
        farmerData.lastName,
        farmerData.nationalId,
        farmerData.city,
        farmerData.phone,
        farmerData.monthlyIncome,
        farmerData.experience,
        farmerData.gender,
        farmerData.ageCategory,
        farmerData.schooling,
        farmerData.accommodation,
        farmerData.residentialStatus,
        farmerData.tenureWithFinancialInstitution,
        farmerData.annualIncome,
        farmerData.country,
        farmerData.verify ? 1 : 0,
        user.google_id,
      ]
    );

    return farmerData.nationalId;   // 🔥 return this for livestock FK
  };

  // ---------------------------
  // Save Livestock
  // ---------------------------
  const saveLivestock = async (livestockData: {
    livestock_tag: string;
    photo_uri: string;
    farmer_id: string;     // 🔥 national ID (TEXT)
  }) => {
    await db.runAsync(
      `INSERT INTO livestock (livestock_tag, photo_uri, farmer_id)
       VALUES (?, ?, ?);`,
      [
        livestockData.livestock_tag,
        livestockData.photo_uri,
        livestockData.farmer_id,
      ]
    );
  };

  // ---------------------------
  // Load session on startup
  // ---------------------------
  useEffect(() => {
    (async () => {
      await initDB();
      const savedUser = await loadSession();

      if (savedUser) setUser(savedUser);
      setLoading(false);
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        handleSignIn,
        logout,
        setUser,
        saveFarmer,
        saveLivestock,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

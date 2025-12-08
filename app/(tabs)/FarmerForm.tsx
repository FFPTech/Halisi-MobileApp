import {
  CameraType,
  useCameraPermissions
} from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  Alert,
  Platform,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { router } from "expo-router";
import StepCamera from "../../components/StepCamera";
import StepLivestock from "../../components/StepLivestock";
import StepNationalId from "../../components/StepNationalID";
import StepOperation from "../../components/StepOperation";
import StepPersonalInfo from "../../components/StepPersonalInfo";
import { useUser } from "../../Hooks/useUserGlobal";
import { loadSession } from "../../storage/saveSession";


// bundled logo asset
const logoAsset = require("../../assets/images/halisi-logo.png");


export default function RegisterFarmers() {
  const { saveFarmer,saveLivestock } = useUser();
const cities = {
    Kenya: ["Nairobi", "Mombasa", "Kisumu"],
    Congo: ["Kinshasa", "Goma", "Lubumbashi"]
  };

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;
const [isEnabled, setIsEnabled] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // Form data states
  const [firstName, setFirstName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [verify, setVerified] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [isMemberCooperative, setIsMemberCooperative] = useState("");

  const [nameOfCooperative, setNameOfCooperative] = useState("");
  const [experience, setExperience] = useState();
const [ageCategory, setAgeCategory] = useState();  
const [schooling, setSchooling] = useState();
const [accommodation, setAccommodation] = useState();
const[residentialStatus,setResidentialStatus]=useState();
const [tenureWithFinancialInstitution, setTenureWithFinancialInstitution] = useState();
const [annualIncome, setAnnualIncome] = useState();
const [farmerKRAPin, setFarmerKRApin] = useState("");
const [livestockPhotoUri, setLivestockPhotoUri] = useState<string | null>(null);
const [livestockTag, setLivestockTag] = useState("");



const handleLivestockSubmit = async () => {
  if (!livestockTag.trim()) {
    Alert.alert("Error", "Livestock tag is required");
    return;
  }

  if (!livestockPhotoUri) {
    Alert.alert("Error", "Please capture livestock photo");
    return;
  }

  if (!nationalId) {
    Alert.alert("Error", "Missing farmer ID. Please restart process.");
    return;
  }

  await saveLivestock({
    livestock_tag: livestockTag,
    photo_uri: livestockPhotoUri,
    farmer_id: nationalId,      // <-- Automatically added!
  });

  Alert.alert("Success", "Livestock registered successfully!");
};

//Validation checks
// const validateStep = () => {
//   const newErrors: { [key: string]: string } = {};

//   switch (step) {
//     case 1: // StepNationalId
//       if (!nationalId?.trim()) newErrors.nationalId = "National ID is required";
//       if (!country?.trim()) newErrors.country = "Country is required";
//       break;

//     case 2: // StepCamera
//       if (!photoUri) newErrors.photoUri = "Profile photo is required";
//       break;

//     case 3: // StepPersonalInfo
//       if (!firstName?.trim()) newErrors.firstName = "First Name is required";
//       if (!lastName?.trim()) newErrors.lastName = "Last Name is required";
//       if (!email?.trim()) newErrors.email = "Email is required";
//       if (!gender?.trim()) newErrors.gender = "Gender is required";
//       if (!nationalId?.trim()) newErrors.nationalId = "National ID is required";
//       if (!monthlyIncome?.trim()) newErrors.monthlyIncome = "Monthly income is required";
//       if (isMemberCooperative && !nameOfCooperative?.trim()) newErrors.nameOfCooperative = "Cooperative name is required";
//       if (!experience) newErrors.experience = "Experience is required";
//       if (!ageCategory) newErrors.ageCategory = "Age category is required";
//       if (!schooling) newErrors.schooling = "Schooling is required";
//       if (!accommodation) newErrors.accommodation = "Accommodation is required";
//       if (!residentialStatus) newErrors.residentialStatus = "Residential status is required";
//       if (!tenureWithFinancialInstitution) newErrors.tenureWithFinancialInstitution = "Tenure is required";
//       if (!annualIncome) newErrors.annualIncome = "Annual income is required";
//       if (!farmerKRAPin?.trim()) newErrors.farmerKRAPin = "KRA Pin is required";
//       break;

//   }

//   setErrors(newErrors);

//   return Object.keys(newErrors).length === 0;
// };



//submit form
  const handleSubmit = async () => {
    if (!firstName || !lastName || !nationalId || !phone) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    try {
      await saveFarmer({
        firstName,
        lastName,
        phone,
        gender,
        dob,
        country,
        city,
       
        nationalId,
        address,
        verify,
        monthlyIncome,
        isMemberCooperative,
        nameOfCooperative,
        experience,
        ageCategory,
        schooling,
        accommodation,
        residentialStatus,
        tenureWithFinancialInstitution,
        annualIncome,
        farmerKRAPin,
      });

      Alert.alert("Success", "Farmer registered successfully");
      // Optionally clear form
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to save farmer");
    }
  };
  // Camera toggle
  const toggleCameraFacing = () =>
    setFacing((current) => (current === "back" ? "front" : "back"));

  // Capture photo
 

  // Validation before moving to next step
const validateStep = () => {
  const newErrors: { [key: string]: string } = {};

  switch (step) {
    case 1:
      if (!nationalId?.trim()) newErrors.nationalId = "National ID is required";
      if (!country?.trim()) newErrors.country = "Country is required";
      break;

    case 2:
      if (!photoUri) newErrors.photoUri = "Profile photo is required";
      break;

    case 3:
      if (!firstName?.trim()) newErrors.firstName = "First Name is required";
      if (!lastName?.trim()) newErrors.lastName = "Last Name is required";

      if (!gender?.trim()) newErrors.gender = "Gender is required";
      if (!nationalId?.trim()) newErrors.nationalId = "National ID is required";
      if (!monthlyIncome?.trim()) newErrors.monthlyIncome = "Monthly income is required";

      if (isMemberCooperative === "Yes" && !nameOfCooperative?.trim())
        newErrors.nameOfCooperative = "Cooperative name is required";

      if (!experience) newErrors.experience = "Experience is required";
      if (!ageCategory) newErrors.ageCategory = "Age category is required";
      if (!schooling) newErrors.schooling = "Schooling is required";
      if (!accommodation) newErrors.accommodation = "Accommodation is required";
      if (!residentialStatus) newErrors.residentialStatus = "Residential status is required";
      if (!tenureWithFinancialInstitution) newErrors.tenureWithFinancialInstitution = "Tenure is required";
      if (!annualIncome) newErrors.annualIncome = "Annual income is required";

      if (!farmerKRAPin?.trim()) newErrors.farmerKRAPin = "KRA Pin is required";
     
  
      break;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  // Save data to AsyncStorage
 

  // --- PDF Certificate download (cross-platform) ---
  const handleDownload = async () => {
    try {
      // Load the logged-in agent's session data
      const agentSession = await loadSession();
      if (!agentSession) {
        throw new Error("No agent session found. Please log in again.");
      }

      const agentId = agentSession.registration_number || agentSession.national_id || "N/A";
      const agentName = agentSession.name || "Unknown Agent";
      const certificateNumber = `CERT-${Date.now()}`;

      const cert = {
        firstName,
        lastName,
        gender,
        phone,
        dob: dob?.toLocaleDateString() ?? "",
        country,
        city,
        address,
        nationalId,
        certificateNumber,
        agentId,
        agentName,
      };

      console.log("handleDownload: starting PDF generation");
      console.log("handleDownload: Agent ID:", agentId, "Agent Name:", agentName);
      console.log("handleDownload: Certificate Number:", certificateNumber);

      // Embed photo from camera base64 if available (most reliable)
      let photoSrc: string | null = null;
      if (photoBase64) {
        photoSrc = `data:image/jpeg;base64,${photoBase64}`;
        console.log("handleDownload: embedding photo from camera base64, size:", photoSrc.length);
      }

      // Prepare logo source (try to embed as base64, fallback to uri)
      let logoSrc: string | null = null;
      try {
        const resolved = RNImage.resolveAssetSource(logoAsset);
        const logoUri = resolved?.uri;
        if (logoUri) {
          try {
            const ext = logoUri.split(".").pop()?.split("?")[0]?.toLowerCase();
            const mime = ext === "png" ? "image/png" : "image/jpeg";
            const base64 = await (FileSystem as any).readAsStringAsync(logoUri, { encoding: (FileSystem as any).EncodingType.Base64 });
            logoSrc = `data:${mime};base64,${base64}`;
          } catch (e) {
            console.warn("Could not read bundled logo as base64, using uri instead:", e);
            logoSrc = logoUri;
          }
        }
      } catch (e) {
        console.warn("Error resolving logo asset:", e);
      }

      // Quick debug: tell whether we will embed base64 or use a uri (remove after debugging)
      console.log("handleDownload: photoBase64 present:", !!photoBase64, "photoUri:", photoUri);
      if (!photoSrc) {
        console.log("handleDownload: no photoSrc will be embedded in PDF");
      } else if (photoSrc.startsWith("data:")) {
        console.log("handleDownload: embedding photo as data URL, length:", photoSrc.length);
      } else {
        console.log("handleDownload: using photo uri:", photoSrc);
      }

      const html = `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              @page { size: A4; margin: 0; }
              @media print { body { margin: 0; padding: 0; } }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
                background: #fff;
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
              }
              .card { 
                width: 100%;
                height: 100%;
                background: #fff; 
                padding: 20mm;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
              }
              .header { text-align: center; color: #2e7d32; margin-bottom: 15mm; }
              .logo { margin-bottom: 8mm; }
              .logo img { height: 25mm; object-fit: contain; }
              .title { font-size: 24px; font-weight: 700; margin-bottom: 3mm; }
              .subtitle { color: #666; font-size: 13px; margin-bottom: 10mm; }
              .row { display: flex; gap: 15mm; }
              .left { flex-shrink: 1; }
              .photo { width: 50mm; height: 40mm;  object-fit: cover; border: 1px solid #ddd; }
              .right { flex: 1; }
              .info { 
                margin-bottom: 5mm; 
                color: #222; 
                font-size: 12px;
                display: flex;
                gap: 3mm; /* increased by 25% */
                align-items: center;
              }
              .label { color: #333; font-weight: 700; width: 20mm; flex-shrink: 0; } /* labels reduced by 75% */
              .value { color: #000; flex: 1; }
              .footer { 
                margin-top: auto; 
                padding-top: 10mm;
                text-align: center; 
                color: #999; 
                font-size: 10px;
                border-top: 1px solid #eee;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                ${logoSrc ? `<div class="logo"><img src="${logoSrc}" /></div>` : ""}
                
                <div class="subtitle"><h1 style="font-size: 32px; font-weight: 900; margin: 4mm 0 4mm 0; color: #1b5e20; letter-spacing: 1px;">OWNERSHIP CERTIFICATE</h1></div>
                <div style="margin-top: 8mm; font-size: 10px; color: #666;">Halici Ownership Certificate Number: ${escapeHtml(cert.certificateNumber)}</div>
              </div>

              <div class="row">
                <div class="left">
                  ${photoSrc ? `<img src="${photoSrc}" class="photo" />` : `<div style="width:60mm;height:70mm; background:#eee;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">No Photo</div>`}
                </div>

                <div class="right">
                  <div class="info"><span class="label font-bold">Full name:</span> <span class="value">${escapeHtml(cert.firstName)} ${escapeHtml(cert.lastName)}</span></div>
                  
                  <div class="info"><span class="label">Phone:</span> <span class="value">${escapeHtml(cert.phone)}</span></div>
                  <div class="info"><span class="label">Gender:</span> <span class="value">${escapeHtml(cert.gender)}</span></div>
                  <div class="info"><span class="label">DOB:</span> <span class="value">${escapeHtml(cert.dob)}</span></div>
                  <div class="info"><span class="label">Country:</span> <span class="value">${escapeHtml(cert.country)}</span></div>
                  <div class="info"><span class="label">City:</span> <span class="value">${escapeHtml(cert.city)}</span></div>
                  <div class="info"><span class="label">Address:</span> <span class="value">${escapeHtml(cert.address)}</span></div>
                  <div class="info"><span class="label">National ID:</span> <span class="value">${escapeHtml(cert.nationalId)}</span></div>
                  <div class="info" style="margin-top: 8mm; padding-top: 8mm; border-top: 1px solid #ddd;"><span class="label">Agent ID:</span> <span class="value">${escapeHtml(cert.agentId)}</span></div>
                  <div class="info"><span class="label">Agent:</span> <span class="value">${escapeHtml(cert.agentName)}</span></div>
                </div>
                
              </div>
              <div style="margin-top: 15mm; padding: 10mm; font-size: 9px; color: #555; line-height: 1.5; border-top: 1px solid #ddd; margin-left: 20mm; margin-right: 20mm;">
                <p style="margin: 0 0 8mm 0;">
                  On ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}, ${escapeHtml(cert.firstName)} ${escapeHtml(cert.lastName)} expressly consented, via the Halisi platform, to the collection, transfer, and processing of both personal data and registered livestock information, specially for the purposes of credit and insurance applications. Data was collected by agent ${escapeHtml(cert.agentName)}.
                </p>
                <p style="margin: 0 0 8mm 0;">
                  Document generated by Halisi on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}, by agent ${escapeHtml(cert.agentName)}.
                </p>
                <p style="margin: 0;">
                  For more information, please contact info@halisi.ai or visit www.halisi.ai
                </p>
              </div>
              </div>


          </body>
        </html>
      `;

      const filename = `Farmer_Certificate_${sanitizeFileName(firstName)}_${sanitizeFileName(lastName)}.pdf`;

      // Web: use base64 and trigger browser download
      if (Platform.OS === "web") {
        console.log("handleDownload: web platform detected");
        const webFile = await Print.printToFileAsync({ html, base64: true });
        console.log("handleDownload: printToFileAsync returned on web", webFile?.base64 ? "with base64" : "without base64");
        if (webFile.base64) {
          console.log("handleDownload: creating download link");
          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${webFile.base64}`;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          link.remove();
          Alert.alert("Success", "Certificate downloaded!");
          return;
        }
        Alert.alert("PDF generated", "PDF created but cannot be saved on this platform.");
        return;
      }

      // Native: generate temp file uri
      console.log("handleDownload: native platform detected, calling printToFileAsync");
      let file: any = null;
      try {
        file = await Print.printToFileAsync({ html, base64: false });
        console.log("handleDownload: printToFileAsync succeeded, file uri:", file?.uri);
      } catch (printErr) {
        console.warn("printToFileAsync failed on first attempt:", printErr);
        // Retry without images (some renderers fail when images are too large/corrupt)
        console.log("handleDownload: retrying printToFileAsync without images");
        const strippedHtml = html
          .replace(/<img[^>]*>/g, "")
          .replace(/<div[^>]*class=\"logo-img\"[^>]*>[\s\S]*?<\/div>/g, "");
        try {
          file = await Print.printToFileAsync({ html: strippedHtml, base64: false });
          console.log("handleDownload: retry succeeded, file uri:", file?.uri);
        } catch (secondErr) {
          console.error("printToFileAsync failed again after stripping images:", secondErr);
          throw printErr; // rethrow original to be handled by outer catch
        }
      }

      // Validate we got a file URI
      if (!file?.uri) {
        console.error("handleDownload: ERROR - file object exists but uri is missing or falsy");
        throw new Error("PDF generated but no file URI returned");
      }

      // Try to share the generated PDF (works on native devices). If sharing unavailable, show temp uri.
      console.log("handleDownload: checking if Sharing is available");
      if (await Sharing.isAvailableAsync()) {
        console.log("handleDownload: Sharing available, calling shareAsync with uri:", file.uri);
        await Sharing.shareAsync(file.uri);
        console.log("handleDownload: shareAsync completed successfully");
      } else {
        console.log("handleDownload: Sharing not available, showing alert");
        Alert.alert("PDF generated", `PDF created. Temp uri: ${file.uri}`);
      }
    } catch (error) {
      console.error("handleDownload: OUTER CATCH - Error generating certificate PDF:", error);
      if (error instanceof Error) {
        console.error("  Error message:", error.message);
        console.error("  Stack:", error.stack);
      }
      Alert.alert("Error", "Failed to generate certificate PDF. See console for details.");
    }
  };

  // small helpers for safety
  function escapeHtml(input: string | undefined | null) {
    if (!input) return "";
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function sanitizeFileName(input: string | undefined | null) {
    if (!input) return "unknown";
    return input.replace(/[^a-z0-9_\-]/gi, "_");
  }

  // Step content rendering
  const renderStepContent = () => {
    if (!permission) return <View />;


    switch (step) {
      case 1:
        return (


<StepNationalId
  isEnabled={isEnabled}
  setIsEnabled={setIsEnabled}
  nationalId={nationalId}
  setNationalId={setNationalId}
  country={country}
  setCountry={setCountry}
  errors={errors}          // <-- REQUIRED
/>
)
      case 2:
        return (

<StepCamera
  permission={permission}
  requestPermission={requestPermission}
  photoUri={photoUri}
  setPhotoUri={setPhotoUri}
  cameraRef={cameraRef}
  facing={facing}
  toggleCameraFacing={toggleCameraFacing}
  setPhotoBase64={setPhotoBase64}
  species="farmer"
  errors={errors}      // <-- REQUIRED
/>
        );

    case 3:
      return (
<StepPersonalInfo
      firstName={firstName}
      lastName={lastName}
      gender={gender}
      nationalId={nationalId}
      setFirstName={setFirstName}
      setLastName={setLastName}
      setGender={setGender}
      setNationalId={setNationalId}
      country={country}
      setCountry={setCountry}
      city={city}
      setCity={setCity}
      phone={phone}
      setPhone={setPhone}
      monthlyIncome={monthlyIncome}
      setMonthlyIncome={setMonthlyIncome}
      isMemberCooperative={isMemberCooperative}
      setIsMemberCooperative={setIsMemberCooperative}
      nameOfCooperative={nameOfCooperative}
      setNameOfCooperative={setNameOfCooperative}
      experience={experience}
      setExperience={setExperience}
      ageCategory={ageCategory}
      setAgeCategory={setAgeCategory}
      schooling={schooling}
      setSchooling={setSchooling}
      accommodation={accommodation}
      setAccommodation={setAccommodation}
      residentialStatus={residentialStatus}
      setResidentialStatus={setResidentialStatus}
      annualIncome={annualIncome}
      setAnnualIncome={setAnnualIncome}
      tenureWithFinancialInstitution={tenureWithFinancialInstitution}
      setTenureWithFinancialInstitution={setTenureWithFinancialInstitution}
      farmerKRAPin={farmerKRAPin}
      setFarmerKRApin={setFarmerKRApin}
      errors={errors} 
      
    />
      );

      case 4:
        const kenyaCities = ["Nairobi", "Mombasa", "Kisumu", "Eldoret", "Nakuru"];
        const congoCities = ["Kinshasa", "Lubumbashi", "Goma", "Kisangani", "Mbandaka"];
        const cityOptions =
          country === "Kenya"
            ? kenyaCities.map((c) => ({ label: c, value: c }))
            : country === "Congo"
            ? congoCities.map((c) => ({ label: c, value: c }))
            : [];

        return (
         
          <StepOperation
          nextStep={nextStep}
      />
        );
        case 5:
          return (
            <StepLivestock
              livestocktag={livestockTag}
              setLivestockTag={setLivestockTag}
              errors={errors}
        />
          );

      case 6:
        return (
          <StepCamera
           permission={permission}
  requestPermission={requestPermission}
  photoUri={livestockPhotoUri}
  setPhotoUri={setLivestockPhotoUri}
  cameraRef={cameraRef}
  facing={facing}
  toggleCameraFacing={toggleCameraFacing}
  setPhotoBase64={setPhotoBase64}
  species="livestock"
  errors={errors}
      />
        );
      }
    };

  return (
    <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>Registration</Text>

          <View style={styles.stepIndicatorContainer}>
            {[1, 2, 3, 4,5,6].map((num) => (
              <View key={num} style={styles.stepItem}>
                <TouchableOpacity onPress={() => setStep(num)}>
                  <View
                    style={[
                      styles.stepCircle,
                      step === num && styles.activeStepCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepText,
                        step === num && styles.activeStepText,
                      ]}
                    >
                      {num}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {renderStepContent()}

          {/* Navigation Buttons */}
{/* Navigation Buttons */}
{step <= totalSteps && (
  <View style={styles.buttonContainer}>
    {/* Back button */}
    {step > 1 && (
      <TouchableOpacity style={styles.nextButton} onPress={prevStep}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    )}

    {/* Step-specific action button */}
    {(() => {
      switch (step) {
        case 3: // Submit Farmer Info
          return (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={async () => {
                if (validateStep()) {
                  try {
                    await handleSubmit(); // save farmer
                    Alert.alert("Success", "Farmer registered successfully!");
                    setStep(step + 1); // go to next step
                  } catch (e) {
                    console.error("Error saving farmer:", e);
                    Alert.alert("Error", "Failed to save farmer");
                  }
                }
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          );

        case 6: // Submit Livestock Info
          return (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={async () => {
                const newErrors: { [key: string]: string } = {};

                if (!livestockTag?.trim()) newErrors.livestockTag = "Livestock tag is required";
                if (!livestockPhotoUri) newErrors.livestockPhotoUri = "Livestock photo is required";

                setErrors(newErrors);

                if (Object.keys(newErrors).length === 0) {
                  try {
                    await handleLivestockSubmit(); // submit livestock
                    Alert.alert("Success", "Farmer and livestock registration complete!");
                    router.replace("/RegisterLiveStock"); // redirect after submission
                  } catch (e) {
                    console.error("Error saving livestock:", e);
                    Alert.alert("Error", "Failed to save livestock");
                  }
                }
              }}
            >
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          );

        default: // Next Step for all other steps
          return (
            <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          );
      }
    })()}
  </View>
)}



        </ScrollView>
        </View>
     
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16, backgroundColor: "#f2f6f2" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#133d23",
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 14,
    gap: 6,
  },
  stepItem: { marginHorizontal: 6 },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeStepCircle: { backgroundColor: "#2e7d32" },
  stepText: { color: "#2e7d32", fontWeight: "700" },
  activeStepText: { color: "#fff" },

  stepCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    // borderRadius: 10,
    shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.06,
    // shadowRadius: 6,
    // elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#2e7d32" },

 

  permissionContainer: { alignItems: "center", justifyContent: "center" },
  permissionText: { textAlign: "center", fontSize: 16, marginBottom: 10 },

  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20,gap:10 },
  backButton: { flex: 1, backgroundColor: "#999", padding: 12, borderRadius: 8, alignItems: "center", marginRight: 10 },
  nextButton: { flex: 1, backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },

  reviewContainer: { flexDirection: "row", gap: 30, alignItems: "flex-start", justifyContent: "space-between" },
  leftColumn: { flex: 1, alignItems: "center" },
  rightColumn: { flex: 2 },
  reviewImage: { width: 100, height: 100, borderRadius: 8 },
  placeholderImage: { width: 100, height: 100, borderRadius: 8, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },

  label: { fontWeight: "700", marginTop: 8, color: "#444", fontSize: 13 },
  value: { color: "#000", fontSize: 14 },

  reviewButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  downloadButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e88e5", padding: 12, borderRadius: 8, paddingHorizontal: 16 },
  submitButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, paddingHorizontal: 16 },





});

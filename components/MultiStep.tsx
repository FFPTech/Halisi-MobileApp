import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

 
export const MultiStepComponent=({step,setStep}:{step:number,setStep:(number)=>void})=>{

  return(
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
  )
}

const styles = StyleSheet.create({
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

});
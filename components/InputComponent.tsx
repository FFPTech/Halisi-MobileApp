import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string; // <-- Pass error message as a prop
}

export default function InputField({ label, style, error, ...props }: InputFieldProps) {
  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input */}
      <TextInput
        {...props}
        style={[
          styles.input,
          style,
          error ? styles.inputError : {}, // Highlight red if error exists
        ]}
        placeholderTextColor="#888"
      />

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    marginVertical: 6,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
    textTransform: "capitalize",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

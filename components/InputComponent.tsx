import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  numbersOnly?: boolean;   // Allow only numbers
  maxNumbers?: number;     // Max number of digits (e.g. 20 for National ID)
}

export default function InputField({
  label,
  style,
  error,
  numbersOnly = false,
  maxNumbers,
  onChangeText,
  ...props
}: InputFieldProps) {
  const handleChangeText = (text: string) => {
    let value = text;

    // ✅ Numbers-only sanitization
    if (numbersOnly) {
      value = value.replace(/[^0-9]/g, "");

      // ✅ Enforce max digit length
      if (maxNumbers && value.length > maxNumbers) {
        value = value.slice(0, maxNumbers);
      }
    }

    onChangeText?.(value);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input */}
      <TextInput
        {...props}
        value={props.value}
        keyboardType={numbersOnly ? "number-pad" : props.keyboardType}
        onChangeText={handleChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        style={[
          styles.input,
          style,
          error ? styles.inputError : null,
        ]}
        placeholderTextColor="#888"
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    marginVertical: 6,
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
    fontSize: 16,
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

import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type LoadingSpinnerProps = {
  size?: "small" | "large" | number;
  color?: string;
};

export default function LoadingSpinner({
  size = "large",
  color = "#000",
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

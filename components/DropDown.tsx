// components/Dropdown.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string; // <-- add error prop
}

export default function Dropdown({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  error,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setVisible(false);
  };

  return (
    <View style={{ marginBottom: 8, width: "100%", paddingHorizontal: 20 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Trigger */}
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error ? styles.dropdownError : null, // highlight red if error
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: selectedValue ? "#000" : "#999" }}>
          {options.find((o) => o.value === selectedValue)?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#666" />
      </TouchableOpacity>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      isSelected && styles.optionActive,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  optionActive: {
    backgroundColor: "#E8F5E9",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextActive: {
    color: "#2E7D32",
    fontWeight: "600",
  },
});

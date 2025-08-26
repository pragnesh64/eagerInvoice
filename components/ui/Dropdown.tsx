import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Option {
  label: string;
  value: string;
}

export interface DropdownProps {
  label?: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  error,
  helperText,
}: DropdownProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={(val) => {
            onValueChange(val);
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.picker}
          dropdownIconColor={error ? "#f87171" : "#9ca3af"}
        >
          <Picker.Item label={placeholder} value="" color="#9ca3af" />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb", // same as Input label
    marginBottom: 6,
  },
  labelError: {
    color: "#f87171", // red-400 for error
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151", // gray-700
    borderRadius: 10,
    backgroundColor: "#111827", // dark background
    overflow: "hidden",
    minHeight: 46,
    justifyContent: "center",
  },
  inputFocused: {
    borderColor: "#3b82f6", // blue-500
    borderWidth: 2,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderColor: "#f87171",
  },
  picker: {
    height: Platform.OS === "ios" ? 180 : 50,
    color: "#f9fafb", // text same as Input
  },
  errorText: {
    color: "#f87171",
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
});

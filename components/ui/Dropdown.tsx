import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { createFocusAnimation } from "../../utils/animationUtils";

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
  labelColor?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  error,
  helperText,
  labelColor = "#f9fafb",
}: DropdownProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation refs
  // Removed borderAnim to fix native driver conflicts
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;
  
  const focusAnimation = createFocusAnimation(scaleAnim, undefined, labelAnim);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.blur();
  };

  return (
    <View style={styles.container}>
      {label && (
        <Animated.Text 
          style={[
            styles.label, 
            error && styles.labelError, 
            { color: labelColor },
            {
              transform: [{ scale: labelAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05]
              })}],
            }
          ]}
        >
          {label}
        </Animated.Text>
      )}

      <Animated.View
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          {
            transform: [{ scale: scaleAnim }],
            borderWidth: isFocused ? 2 : 1,
          }
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={(val) => {
            onValueChange(val);
            handleBlur();
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
      </Animated.View>

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

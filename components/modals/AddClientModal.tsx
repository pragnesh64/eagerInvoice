import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useDatabase } from "../../context/DatabaseContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Button } from "../ui/Button";
import { DatePicker } from "../ui/DatePicker";
import { Dropdown } from "../ui/Dropdown";
import { Input } from "../ui/Input";

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const CLIENT_TYPES = [
  { label: "Micro", value: "Micro" },
  { label: "Mid", value: "Mid" },
  { label: "Core", value: "Core" },
  { label: "Large Retainer", value: "Large Retainer" },
];

export function AddClientModal({
  visible,
  onClose,
  onRefresh,
}: AddClientModalProps) {
  const { clients } = useDatabase();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    startDate: new Date(),
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formattedDate = formData.startDate.toISOString().split("T")[0];

      await clients.create({
        name: formData.name.trim(),
        type: formData.type as
          | "Micro"
          | "Mid"
          | "Core"
          | "Large Retainer",
        startDate: formattedDate,
        notes: formData.notes.trim(),
      });

      Alert.alert("Success", "Client added successfully!");
      if (onRefresh) onRefresh();
      handleCancel();
    } catch (error) {
      console.error("Error adding client:", error);
      Alert.alert("Error", "Failed to add client. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      type: "",
      startDate: new Date(),
      notes: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Header */}
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add New Client
            </Text>
            <Button title="Close" variant="ghost" size="sm" onPress={handleCancel} />
          </View>

          {/* Form */}
          <ScrollView
            style={styles.formScrollView}
            contentContainerStyle={styles.formContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputGroup}>
              <Input
                label="Client Name *"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                placeholder="Enter client name"
                error={errors.name}
              />
            </View>

            <View style={styles.inputGroup}>
              <Dropdown
                label="Client Type *"
                options={CLIENT_TYPES}
                value={formData.type}
                onValueChange={(value) => updateFormData("type", value)}
                placeholder="Select client type"
                error={errors.type}
              />
            </View>

            <View style={styles.inputGroup}>
              <DatePicker
                label="Start Date *"
                value={formData.startDate}
                onChange={(date) => updateFormData("startDate", date)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Input
                label="Notes"
                value={formData.notes}
                onChangeText={(value) => updateFormData("notes", value)}
                placeholder="Enter additional notes"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>


          {/* Footer */}
          <View
            style={[styles.modalFooter, { borderTopColor: colors.border }]}
          >
            <Button
              title="Add Client"
              variant="primary"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.6)", // darker backdrop
    justifyContent: "flex-end",
  },
  modalView: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    width: "100%",
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 12 },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitButton: {
    width: "100%",
    height: 52,
    borderRadius: 12,
  },
  formScrollView: {
    backgroundColor: "transparent", // don't block
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inputGroup: {
    marginBottom: 20, // proper spacing between fields
  },

});

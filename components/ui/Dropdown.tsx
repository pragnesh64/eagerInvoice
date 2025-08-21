import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './Button';

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
  searchable?: boolean;
}

export function Dropdown({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  error,
  searchable = false,
}: DropdownProps) {
  const [show, setShow] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const selectedOption = options.find(option => option.value === value);

  const handleConfirm = () => {
    onValueChange(tempValue);
    setShow(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setShow(false);
  };

  const showPicker = () => {
    setTempValue(value);
    setShow(true);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={showPicker}
      >
        <Text style={[
          styles.text,
          !selectedOption && styles.placeholder
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={show}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tempValue}
                onValueChange={setTempValue}
                style={styles.picker}
              >
                <Picker.Item
                  label={placeholder}
                  value=""
                  color="#9ca3af"
                />
                {options.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    color="#111827"
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.modalFooter}>
              <Button 
                title="Cancel"
                variant="ghost"
                onPress={handleCancel}
                style={styles.footerButton}
              />
              <Button
                title="Confirm"
                variant="primary"
                onPress={handleConfirm}
                style={styles.footerButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    height: 44,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  text: {
    fontSize: 16,
    color: '#111827',
  },
  placeholder: {
    color: '#9ca3af',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 200,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  footerButton: {
    minWidth: 100,
  },
}); 
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  style?: any;
}

export function DatePicker({ label, value, onChange, error, style }: DatePickerProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setShow(false);
  };

  const showDatepicker = () => {
    setTempDate(value);
    setShow(true);
  };

  const formattedDate = value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Pressable
        style={[styles.input, error && styles.inputError]}
        onPress={showDatepicker}
      >
        <Text style={styles.dateText}>{formattedDate}</Text>
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {Platform.OS === 'android' ? (
        show && (
          <DateTimePicker
            value={value}
            mode="date"
            display="default"
            onChange={handleChange}
          />
        )
      ) : (
        <Modal
          visible={show}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                style={styles.datePicker}
              />
              
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
      )}
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
  dateText: {
    fontSize: 16,
    color: '#111827',
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
  datePicker: {
    height: 200,
    marginBottom: 16,
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
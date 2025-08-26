import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Button } from './Button';

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  style?: any;
}

export function DatePicker({ label, value, onChange, error, style }: DatePickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 4,
  });

  const getInputStyle = (): ViewStyle => ({
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: error ? colors.error : colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center' as const,
  });

  const getDateTextStyle = (): TextStyle => ({
    fontSize: 16,
    color: colors.text,
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  });

  const getModalContentStyle = (): ViewStyle => ({
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    width: '90%' as any,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  });

  const getModalTitleStyle = (): TextStyle => ({
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  });

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
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <Pressable
        style={getInputStyle()}
        onPress={showDatepicker}
      >
        <Text style={getDateTextStyle()}>{formattedDate}</Text>
      </Pressable>

      {error && <Text style={getErrorStyle()}>{error}</Text>}

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
          presentationStyle="overFullScreen"
        >
          <View style={styles.modalOverlay}>
            <View style={getModalContentStyle()}>
              <View style={styles.modalHeader}>
                <Text style={getModalTitleStyle()}>Select Date</Text>
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                style={styles.datePicker}
                textColor="#000"
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  datePicker: {
    height: Platform.OS === 'ios' ? 200 : 120,
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
}); 
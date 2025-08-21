import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Dropdown } from '../ui/Dropdown';
import { Input } from '../ui/Input';

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
}

const CLIENT_TYPES = [
  { label: 'Micro', value: 'Micro' },
  { label: 'Mid', value: 'Mid' },
  { label: 'Core', value: 'Core' },
  { label: 'Large Retainer', value: 'Large Retainer' },
];

export function AddClientModal({ visible, onClose }: AddClientModalProps) {
  const { clients } = useDatabase();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: new Date(),
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Format date as YYYY-MM-DD
      const formattedDate = formData.startDate.toISOString().split('T')[0];

      await clients.create({
        name: formData.name.trim(),
        type: formData.type as 'Micro' | 'Mid' | 'Core' | 'Large Retainer',
        startDate: formattedDate,
        notes: formData.notes.trim(),
      });

      Alert.alert('Success', 'Client added successfully!');
      handleCancel();
    } catch (error) {
      console.error('Error adding client:', error);
      Alert.alert('Error', 'Failed to add client. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      type: '',
      startDate: new Date(),
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Client</Text>
            <Button 
              title="Cancel" 
              variant="ghost" 
              size="sm" 
              onPress={handleCancel}
            />
          </View>

          <ScrollView 
            style={styles.formScrollView}
            contentContainerStyle={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputContainer}>
              <Input
                label="Client Name *"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Enter client name"
                error={errors.name}
              />
            </View>

            <View style={styles.inputContainer}>
              <Dropdown
                label="Client Type *"
                options={CLIENT_TYPES}
                value={formData.type}
                onValueChange={(value) => updateFormData('type', value)}
                placeholder="Select client type"
                error={errors.type}
              />
            </View>

            <View style={styles.inputContainer}>
              <DatePicker
                label="Start Date *"
                value={formData.startDate}
                onChange={(date) => updateFormData('startDate', date)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Notes"
                value={formData.notes}
                onChangeText={(value) => updateFormData('notes', value)}
                placeholder="Enter additional notes"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
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
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // This will make the modal slide up from bottom
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '85%', // Increased height
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  formScrollView: {
    flex: 1, // Changed to flex 1 to take remaining space
  },
  formContainer: {
    padding: 20,
    paddingTop: 25,
    gap: 24, // Added gap between form elements
  },
  inputContainer: {
    marginBottom: 0, // Removed margin bottom since we're using gap
  },
  modalFooter: {
    padding: 20,
    paddingBottom: 30, // Increased bottom padding
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    width: '100%',
    height: 50, // Increased button height
  },
}); 
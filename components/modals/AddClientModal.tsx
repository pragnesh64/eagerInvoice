import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useData } from '../../context/DataContext';
import { Client } from '../../data/dummyData';
import { Button, Dropdown } from '../ui';

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddClientModal({ visible, onClose }: AddClientModalProps) {
  const { addClient } = useData();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Micro' as Client['type'],
    startDate: new Date().toISOString().split('T')[0], // Today's date
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Client type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    try {
      addClient({
        name: formData.name.trim(),
        type: formData.type,
        startDate: formData.startDate,
        notes: formData.notes.trim() || undefined,
      });

      // Reset form
      setFormData({
        name: '',
        type: 'Micro',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setErrors({});

      Alert.alert('Success', 'Client added successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add client. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      type: 'Micro',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setErrors({});
    onClose();
  };

  const typeOptions = [
    { label: 'Micro', value: 'Micro' },
    { label: 'Mid', value: 'Mid' },
    { label: 'Core', value: 'Core' },
    { label: 'Large Retainer', value: 'Large Retainer' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add New Client</Text>
          <Button title="Cancel" variant="ghost" size="sm" onPress={handleCancel} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Client Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Client Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Enter client name"
                placeholderTextColor="#9ca3af"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Client Type */}
            <View style={styles.field}>
              <Dropdown
                label="Client Type *"
                options={typeOptions}
                value={formData.type}
                onValueChange={(value) => updateFormData('type', value as Client['type'])}
                placeholder="Select client type"
              />
              {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
            </View>

            {/* Start Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Start Date *</Text>
              <TextInput
                style={[styles.input, errors.startDate && styles.inputError]}
                value={formData.startDate}
                onChangeText={(value) => updateFormData('startDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
              />
              {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
            </View>

            {/* Notes */}
            <View style={styles.field}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(value) => updateFormData('notes', value)}
                placeholder="Add any notes about this client"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button title="Add Client" variant="primary" onPress={handleSubmit} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
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
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
}); 
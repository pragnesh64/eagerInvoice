import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useData } from '../../context/DataContext';
import { generateInvoiceNumber } from '../../data/dummyData';
import { Button, Dropdown } from '../ui';

interface AddInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddInvoiceModal({ visible, onClose }: AddInvoiceModalProps) {
  const { addInvoice, clients } = useData();
  const [formData, setFormData] = useState({
    clientId: '',
    invoiceNo: generateInvoiceNumber(),
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date
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

    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }

    if (!formData.invoiceNo.trim()) {
      newErrors.invoiceNo = 'Invoice number is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    try {
      const selectedClient = clients.find(client => client.id === formData.clientId);
      if (!selectedClient) {
        Alert.alert('Error', 'Selected client not found.');
        return;
      }

      addInvoice({
        clientId: formData.clientId,
        clientName: selectedClient.name,
        invoiceNo: formData.invoiceNo.trim(),
        amount: parseFloat(formData.amount),
        date: formData.date,
      });

      // Reset form
      setFormData({
        clientId: '',
        invoiceNo: generateInvoiceNumber(),
        amount: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});

      Alert.alert('Success', 'Invoice added successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add invoice. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      clientId: '',
      invoiceNo: generateInvoiceNumber(),
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    onClose();
  };

  const clientOptions = clients.map(client => ({
    label: `${client.name} (${client.type})`,
    value: client.id,
  }));

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
          <Text style={styles.title}>Add New Invoice</Text>
          <Button title="Cancel" variant="ghost" size="sm" onPress={handleCancel} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Client Selection */}
            <View style={styles.field}>
              <Dropdown
                label="Client *"
                options={clientOptions}
                value={formData.clientId}
                onValueChange={(value) => updateFormData('clientId', value)}
                placeholder="Select a client"
                searchable={true}
              />
              {errors.clientId && <Text style={styles.errorText}>{errors.clientId}</Text>}
            </View>

            {/* Invoice Number */}
            <View style={styles.field}>
              <Text style={styles.label}>Invoice Number *</Text>
              <TextInput
                style={[styles.input, errors.invoiceNo && styles.inputError]}
                value={formData.invoiceNo}
                onChangeText={(value) => updateFormData('invoiceNo', value)}
                placeholder="Enter invoice number"
                placeholderTextColor="#9ca3af"
              />
              {errors.invoiceNo && <Text style={styles.errorText}>{errors.invoiceNo}</Text>}
            </View>

            {/* Amount */}
            <View style={styles.field}>
              <Text style={styles.label}>Amount (₹) *</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                value={formData.amount}
                onChangeText={(value) => updateFormData('amount', value)}
                placeholder="Enter amount"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={[styles.input, errors.date && styles.inputError]}
                value={formData.date}
                onChangeText={(value) => updateFormData('date', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
              />
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button title="Add Invoice" variant="primary" onPress={handleSubmit} />
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

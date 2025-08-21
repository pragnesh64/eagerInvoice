import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDatabase } from '../../context/DatabaseContext';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Dropdown } from '../ui/Dropdown';
import { Input } from '../ui/Input';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
}

interface AddInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddInvoiceModal({ visible, onClose }: AddInvoiceModalProps) {
  const { clients, invoices } = useDatabase();
  const [clientList, setClientList] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    invoiceNo: '',
    amount: '',
    date: new Date(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const allClients = await clients.getAll();
      setClientList(allClients || []);

      const latestInvoiceNo = await invoices.getLatestInvoiceNumber();
      const nextInvoiceNo = latestInvoiceNo ? 
        `INV-${(parseInt(latestInvoiceNo.split('-')[1]) + 1).toString().padStart(3, '0')}` : 
        'INV-001';

      setFormData(prev => ({ ...prev, invoiceNo: nextInvoiceNo }));
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await invoices.create({
        clientId: formData.clientId,
        invoiceNo: formData.invoiceNo.trim(),
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString().split('T')[0],
      });

      await loadData();
      setFormData(prev => ({
        ...prev,
        clientId: '',
        amount: '',
        date: new Date(),
      }));
      setErrors({});

      Alert.alert('Success', 'Invoice added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding invoice:', error);
      Alert.alert('Error', 'Failed to add invoice. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      clientId: '',
      invoiceNo: '',
      amount: '',
      date: new Date(),
    });
    setErrors({});
    onClose();
  };

  const clientOptions = clientList.map(client => ({
    label: `${client.name} (${client.type})`,
    value: client.id,
  }));

  if (isLoading) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, styles.loadingContainer]}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </Modal>
    );
  }

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
            <Text style={styles.modalTitle}>Add New Invoice</Text>
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
              <Dropdown
                label="Client *"
                options={clientOptions}
                value={formData.clientId}
                onValueChange={(value) => updateFormData('clientId', value)}
                placeholder="Select a client"
                error={errors.clientId}
                searchable={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Invoice Number *"
                value={formData.invoiceNo}
                onChangeText={(value) => updateFormData('invoiceNo', value)}
                placeholder="Enter invoice number"
                error={errors.invoiceNo}
              />
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Amount (₹) *"
                value={formData.amount}
                onChangeText={(value) => updateFormData('amount', value)}
                placeholder="Enter amount"
                keyboardType="numeric"
                error={errors.amount}
              />
            </View>

            <View style={styles.inputContainer}>
              <DatePicker
                label="Date *"
                value={formData.date}
                onChange={(date) => updateFormData('date', date)}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Add Invoice"
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
  loadingContainer: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
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


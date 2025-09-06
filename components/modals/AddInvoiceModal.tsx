import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDatabase } from '../../context/DatabaseContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useInvoiceSync } from '../../hooks/useSyncData';
import { validateInvoiceAmount } from '../../utils/calculationUtils';
import { rupeesToPaise } from '../../utils/currencyUtils';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Dropdown } from '../ui/Dropdown';
import { Input } from '../ui/Input';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  createdAt: string;
}

interface AddInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export function AddInvoiceModal({ visible, onClose, onRefresh }: AddInvoiceModalProps) {
  const { clients, invoices } = useDatabase();
  const { syncAfterInvoiceOperation, syncState } = useInvoiceSync();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [clientList, setClientList] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    date: new Date(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading clients for AddInvoiceModal...');
      
      const allClients = await clients.getAll();
      console.log('📋 Loaded clients:', allClients.map(c => ({ id: c.id, name: c.name, type: c.type })));
      
      if (!allClients || allClients.length === 0) {
        console.warn('⚠️ No clients found in database');
        Alert.alert('Warning', 'No clients found. Please add a client first.');
        return;
      }
      
      const mappedClients = allClients.map(client => ({
        id: client.id,
        name: client.name,
        type: client.type,
        createdAt: client.createdAt
      }));
      
      setClientList(mappedClients);
      console.log('✅ Client list updated:', mappedClients.length, 'clients');

    } catch (error) {
      console.error('❌ Error loading clients:', error);
      Alert.alert('Error', 'Failed to load clients. Please try again.');
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

    if (!formData.clientId || formData.clientId.trim() === '') {
      newErrors.clientId = 'Client is required';
    } else {
      // Verify the selected client exists in the loaded client list
      const selectedClient = clientList.find(c => c.id === formData.clientId);
      if (!selectedClient) {
        console.error('❌ Selected client not found in client list:', {
          selectedId: formData.clientId,
          availableClients: clientList.map(c => ({ id: c.id, name: c.name }))
        });
        newErrors.clientId = 'Selected client is invalid. Please select a valid client.';
      }
    }

    // Use centralized validation
    const amountValidation = validateInvoiceAmount(formData.amount);
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error || 'Invalid amount';
    }

    // Validate date is not in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (formData.date > today) {
      newErrors.date = 'Invoice date cannot be in the future';
    }

    // Validate date is not too old (e.g., more than 5 years ago)
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    if (formData.date < fiveYearsAgo) {
      newErrors.date = 'Invoice date cannot be more than 5 years ago';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const amountValidation = validateInvoiceAmount(formData.amount);
      if (!amountValidation.isValid || !amountValidation.value) {
        Alert.alert('Error', 'Invalid amount');
        return;
      }

      const invoiceMonth = formData.date.toISOString().slice(0, 7);

      // Debug: Log the form data being submitted
      console.log('📝 Submitting invoice with data:', {
        clientId: formData.clientId,
        amount: amountValidation.value,
        date: formData.date.toISOString().split('T')[0],
        clientList: clientList.map(c => ({ id: c.id, name: c.name }))
      });

      // Create the invoice
      await invoices.create({
        clientId: formData.clientId,
        amount: rupeesToPaise(amountValidation.value),
        date: formData.date.toISOString().split('T')[0],
      });

      // Trigger real-time synchronization for commission and profit calculations
      await syncAfterInvoiceOperation('create', { month: invoiceMonth });

      Alert.alert('Success', 'Invoice added successfully! Commission and profit updated.');
      
      // Refresh the parent component's data
      if (onRefresh) {
        onRefresh();
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error adding invoice:', error);
      Alert.alert('Error', 'Failed to add invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      clientId: '',
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
          <View style={[styles.modalView, styles.loadingContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
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
        <View style={[styles.modalView, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Invoice</Text>
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
                options={clientList.map(client => ({ label: client.name, value: client.id }))}
                value={formData.clientId}
                onValueChange={(value) => updateFormData('clientId', value)}
                placeholder="Select a client"
                error={errors.clientId}
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

          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <Button
              title={isSubmitting || syncState.isSyncing ? "Processing..." : "Add Invoice"}
              variant="primary"
              onPress={handleSubmit}
              disabled={isSubmitting || syncState.isSyncing}
              style={styles.submitButton}
            />
            {syncState.syncError && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                Sync Error: {syncState.syncError}
              </Text>
            )}
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
    justifyContent: 'flex-end',
  },
  modalView: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '85%',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 25,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  formScrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingTop: 25,
    gap: 24,
  },
  inputContainer: {
    marginBottom: 0,
  },
  modalFooter: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  submitButton: {
    width: '100%',
    height: 50,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});


import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDatabase } from '../../context/DatabaseContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useInvoiceSync } from '../../hooks/useSyncData';
import { validateInvoiceAmount } from '../../utils/calculationUtils';
import { paiseToRupees, rupeesToPaise } from '../../utils/currencyUtils';
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

interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
}

interface EditInvoiceModalProps {
  visible: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export function EditInvoiceModal({ visible, invoice, onClose, onRefresh }: EditInvoiceModalProps) {
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
    if (visible && invoice) {
      loadData();
    }
  }, [visible, invoice]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const allClients = await clients.getAll();
      setClientList(allClients.map(client => ({
        id: client.id,
        name: client.name,
        type: client.type,
        createdAt: client.createdAt
      })));

      // Set form data from invoice
      if (invoice) {
        setFormData({
          clientId: invoice.clientId,
          amount: paiseToRupees(invoice.amount).toString(), // Convert from paise to rupees
          date: new Date(invoice.date),
        });
      }
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
    if (!validateForm() || !invoice || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const amountValidation = validateInvoiceAmount(formData.amount);
      if (!amountValidation.isValid || !amountValidation.value) {
        Alert.alert('Error', 'Invalid amount');
        return;
      }

      const originalMonth = new Date(invoice.date).toISOString().slice(0, 7);
      const newMonth = formData.date.toISOString().slice(0, 7);

      // Update the invoice
      await invoices.update(invoice.id, {
        clientId: formData.clientId,
        amount: rupeesToPaise(amountValidation.value),
        date: formData.date.toISOString().split('T')[0],
      });

      // Trigger real-time synchronization for commission and profit calculations
      if (originalMonth !== newMonth) {
        // Month changed - sync both months
        await syncAfterInvoiceOperation('update', { 
          month: newMonth, 
          oldMonth: originalMonth 
        });
      } else {
        // Same month - sync current month
        await syncAfterInvoiceOperation('update', { month: newMonth });
      }

      Alert.alert('Success', 'Invoice updated successfully! Commission and profit recalculated.');
      
      // Refresh the parent component's data
      if (onRefresh) {
        onRefresh();
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error updating invoice:', error);
      Alert.alert('Error', 'Failed to update invoice. Please try again.');
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Invoice {invoice?.invoiceNo}
            </Text>
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
              title="Update Invoice"
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
    fontSize: 20,
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
  },
});

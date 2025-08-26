import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDatabase } from '../../context/DatabaseContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Button } from '../ui/Button';
import { DatePicker } from '../ui/DatePicker';
import { Dropdown } from '../ui/Dropdown';
import { Input } from '../ui/Input';

interface Client {
  id: string;
  name: string;
  type: 'Micro' | 'Mid' | 'Core' | 'Large Retainer';
  startDate: string;
  notes?: string;
  createdAt: string;
}

interface EditClientModalProps {
  visible: boolean;
  client: Client | null;
  onClose: () => void;
  onRefresh?: () => void;
}

const CLIENT_TYPES = [
  { label: 'Micro', value: 'Micro' },
  { label: 'Mid', value: 'Mid' },
  { label: 'Core', value: 'Core' },
  { label: 'Large Retainer', value: 'Large Retainer' },
];

export function EditClientModal({ visible, client, onClose, onRefresh }: EditClientModalProps) {
  const { clients } = useDatabase();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: new Date(),
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load client data when modal opens
  useEffect(() => {
    if (visible && client) {
      setFormData({
        name: client.name,
        type: client.type,
        startDate: new Date(client.startDate),
        notes: client.notes || '',
      });
      setErrors({});
    }
  }, [visible, client]);

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
    if (!validateForm() || !client) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = formData.startDate.toISOString().split('T')[0];

      await clients.update(client.id, {
        name: formData.name.trim(),
        type: formData.type as 'Micro' | 'Mid' | 'Core' | 'Large Retainer',
        startDate: formattedDate,
        notes: formData.notes.trim(),
      });

      Alert.alert('Success', 'Client updated successfully!');
      
      // Refresh the parent component's data
      if (onRefresh) {
        onRefresh();
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error updating client:', error);
      Alert.alert('Error', 'Failed to update client. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    setIsSubmitting(false);
    onClose();
  };

  if (!client) {
    return null;
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Client</Text>
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

          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <Button
              title={isSubmitting ? "Updating..." : "Update Client"}
              variant="primary"
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={isSubmitting}
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
});

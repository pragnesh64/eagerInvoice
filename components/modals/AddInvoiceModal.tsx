import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useData } from '../../context/DataContext';
import { Invoice, InvoiceItem } from '../../data/dummyData';
import { Button, Dropdown } from '../ui';

interface AddInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
}

interface InvoiceItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
}

export function AddInvoiceModal({ visible, onClose }: AddInvoiceModalProps) {
  const { addInvoice, clients } = useData();

  const [formData, setFormData] = useState({
    clientId: "",
    description: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "draft" as Invoice["status"],
  });

  const [items, setItems] = useState<InvoiceItemForm[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = "Please select a client";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue date is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (new Date(formData.dueDate) <= new Date(formData.issueDate)) {
      newErrors.dueDate = "Due date must be after issue date";
    }

    // Validate items
    items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item${index}Description`] = "Item description is required";
      }
      if (item.quantity <= 0) {
        newErrors[`item${index}Quantity`] = "Quantity must be greater than 0";
      }
      if (item.unitPrice <= 0) {
        newErrors[`item${index}Price`] = "Unit price must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    try {
      const { subtotal, tax, total } = calculateTotals();
      const selectedClient = clients.find((c) => c.id === formData.clientId);

      if (!selectedClient) {
        Alert.alert("Error", "Selected client not found.");
        return;
      }

      const invoiceItems: InvoiceItem[] = items.map((item, index) => ({
        id: (index + 1).toString(),
        description: item.description.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      }));

      addInvoice({
        invoiceNumber: `INV-${(Date.now() % 1000).toString().padStart(3, "0")}`,
        clientId: formData.clientId,
        clientName: selectedClient.name,
        amount: subtotal,
        tax: tax,
        totalAmount: total,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        status: formData.status,
        description: formData.description.trim(),
        items: invoiceItems,
      });

      Alert.alert("Success", "Invoice created successfully!");
      handleClose();
    } catch (error) {
      Alert.alert("Error", "Failed to create invoice. Please try again.");
    }
  };

  const handleClose = () => {
    setFormData({
      clientId: "",
      description: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "draft",
    });
    setItems([{ description: "", quantity: 1, unitPrice: 0 }]);
    setErrors({});
    onClose();
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItemForm,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  // Create client options for dropdown
  const clientOptions = clients.map((client) => ({
    label: `${client.name} (${client.email})`,
    value: client.id,
  }));

  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Invoice</Text>
          <Button
            title="Cancel"
            variant="ghost"
            size="sm"
            onPress={handleClose}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Client Selection */}
            <Dropdown
              label="Client *"
              options={clientOptions}
              value={formData.clientId}
              onValueChange={(value) => updateFormData("clientId", value)}
              placeholder="Select a client"
              searchable={true}
            />
            {errors.clientId && (
              <Text style={styles.errorText}>{errors.clientId}</Text>
            )}

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.description && styles.inputError,
                ]}
                value={formData.description}
                onChangeText={(value) => updateFormData("description", value)}
                placeholder="Enter invoice description"
                multiline
                numberOfLines={3}
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            {/* Dates */}
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Issue Date *</Text>
                <TextInput
                  style={[styles.input, errors.issueDate && styles.inputError]}
                  value={formData.issueDate}
                  onChangeText={(value) => updateFormData("issueDate", value)}
                  placeholder="YYYY-MM-DD"
                />
                {errors.issueDate && (
                  <Text style={styles.errorText}>{errors.issueDate}</Text>
                )}
              </View>

              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Due Date *</Text>
                <TextInput
                  style={[styles.input, errors.dueDate && styles.inputError]}
                  value={formData.dueDate}
                  onChangeText={(value) => updateFormData("dueDate", value)}
                  placeholder="YYYY-MM-DD"
                />
                {errors.dueDate && (
                  <Text style={styles.errorText}>{errors.dueDate}</Text>
                )}
              </View>
            </View>

            {/* Status */}
            <Dropdown
              label="Status"
              options={statusOptions}
              value={formData.status}
              onValueChange={(value) => updateFormData("status", value)}
              placeholder="Select status"
            />

            {/* Items */}
            <View style={styles.field}>
              <View style={styles.itemsHeader}>
                <Text style={styles.label}>Items</Text>
                <Button
                  title="Add Item"
                  variant="outline"
                  size="sm"
                  onPress={addItem}
                />
              </View>

              {items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemFields}>
                    <TextInput
                      style={[
                        styles.input,
                        styles.itemDescription,
                        errors[`item${index}Description`] && styles.inputError,
                      ]}
                      value={item.description}
                      onChangeText={(value) =>
                        updateItem(index, "description", value)
                      }
                      placeholder="Item description"
                    />
                    <TextInput
                      style={[
                        styles.input,
                        styles.itemQuantity,
                        errors[`item${index}Quantity`] && styles.inputError,
                      ]}
                      value={item.quantity.toString()}
                      onChangeText={(value) =>
                        updateItem(index, "quantity", parseInt(value) || 0)
                      }
                      placeholder="Qty"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={[
                        styles.input,
                        styles.itemPrice,
                        errors[`item${index}Price`] && styles.inputError,
                      ]}
                      value={item.unitPrice.toString()}
                      onChangeText={(value) =>
                        updateItem(index, "unitPrice", parseFloat(value) || 0)
                      }
                      placeholder="Price"
                      keyboardType="numeric"
                    />
                  </View>
                  {items.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax (10%):</Text>
                <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={[styles.totalRow, styles.grandTotal]}>
                <Text style={styles.grandTotalLabel}>Total:</Text>
                <Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Create Invoice"
            variant="primary"
            onPress={handleSubmit}
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemFields: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  itemDescription: {
    flex: 2,
  },
  itemQuantity: {
    flex: 1,
  },
  itemPrice: {
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  totals: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 8,
    paddingTop: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
  },
  footer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});

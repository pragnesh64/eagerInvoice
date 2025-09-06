import { BlurView } from "expo-blur";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { formatCurrency } from "../utils/currencyUtils";
import { IconSymbol } from "./ui";

interface InvoiceCardProps {
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "draft";
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  style?: ViewStyle;
}

export function InvoiceCard({
  invoiceNumber,
  clientName,
  amount,
  date,
  dueDate,
  status,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
  style,
}: InvoiceCardProps) {
  const formatDate = (dateString: string) => {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return "Invalid date";
      const [year, month, day] = dateString.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      if (isNaN(dateObj.getTime())) return "Invalid date";
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
      case "pending":
        return { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" };
      case "overdue":
        return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
      case "draft":
        return { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" };
      default:
        return { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={10} tint="light" style={styles.blurView}>
        {/* Content */}
        <TouchableOpacity
          style={styles.content}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
              <View style={styles.metaRow}>
                <IconSymbol name="person.2.fill" size={14} color="#cbd5e1" />
                <Text style={styles.clientName}>{clientName}</Text>
              </View>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.amountSection}>
              <Text style={styles.amount}>{formatCurrency(amount)}</Text>
            </View>
            
            <View style={styles.dateSection}>
              <View style={styles.dateRow}>
                <IconSymbol name="calendar" size={14} color="#cbd5e1" />
                <Text style={styles.dateText}>
                  Issued: {formatDate(date)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        {showActions && (onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onEdit}
                activeOpacity={0.6}
              >
                <IconSymbol name="pencil" size={16} color="#3b82f6" />
                <Text style={[styles.actionText, { color: "#3b82f6" }]}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onDelete}
                activeOpacity={0.6}
              >
                <IconSymbol name="trash" size={16} color="#ef4444" />
                <Text style={[styles.actionText, { color: "#ef4444" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    borderRadius: 20,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(21, 21, 21, 0.26)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.43)",
  },
  blurView: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  content: {
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleSection: {
    flex: 1,
    marginRight: 10,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clientName: {
    fontSize: 16,
    color: "#d1d5db",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  details: {
    marginTop: 6,
  },
  amountSection: {
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10b981",
    textAlign: "left",
  },
  dateSection: {
    gap: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: "#f1f5f9",
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
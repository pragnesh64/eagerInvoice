import { BlurView } from "expo-blur";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { IconSymbol } from "./ui";

interface Client {
  id: string;
  name: string;
  type: "Micro" | "Mid" | "Core" | "Large Retainer";
  startDate: string;
  notes?: string;
}

export interface ClientCardProps {
  client: Client;
  onDelete?: () => void;
  onEdit?: () => void;
  onInvoices?: () => void;
  style?: ViewStyle;
  showActions?: boolean;
}

export function ClientCard({
  client,
  onDelete,
  onEdit,
  onInvoices,
  style,
  showActions = true,
}: ClientCardProps) {
  const getTypeConfig = (type: Client["type"]) => {
    switch (type) {
      case "Micro":
        return { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
      case "Mid":
        return { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" };
      case "Core":
        return { color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" };
      case "Large Retainer":
        return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
      default:
        return { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return "Invalid date";
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const typeConfig = getTypeConfig(client.type);

  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={10} tint="light" style={styles.blurView}>
        {/* Glossy shine overlay */}
        <View />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.clientName}>{client.name}</Text>
              <View style={styles.metaRow}>
                <IconSymbol name="calendar" size={14} color="#cbd5e1" />
                <Text style={styles.startDate}>
                  Started {formatDate(client.startDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.typeBadge, { backgroundColor: typeConfig.bg }]}>
              <Text style={[styles.typeText, { color: typeConfig.color }]}>
                {client.type}
              </Text>
            </View>
          </View>

          {client.notes && (
            <View style={styles.notesSection}>
              <IconSymbol name="note.text" size={14} color="#cbd5e1" />
              <Text style={styles.notesText} numberOfLines={2}>
                {client.notes}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {showActions && (onEdit || onInvoices || onDelete) && (
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

            {onInvoices && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onInvoices}
                activeOpacity={0.6}
              >
                <IconSymbol name="doc.text.fill" size={16} color="#10b981" />
                <Text style={[styles.actionText, { color: "#10b981" }]}>
                  Invoices
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
  clientName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  startDate: {
    fontSize: 13,
    color: "#d1d5db",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  notesSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
    gap: 6,
  },
  notesText: {
    flex: 1,
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

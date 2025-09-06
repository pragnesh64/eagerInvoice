/**
 * Month Filter Component
 * Simple and reliable month/year picker without external dependencies
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

interface MonthFilterProps {
  selectedMonth?: string;
  onMonthChange: (month: string) => void;
  showCurrentMonth?: boolean;
  pastMonths?: number;
  futureMonths?: number;
  label?: string;
  style?: any;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthFilter({
  selectedMonth,
  onMonthChange,
  showCurrentMonth = true,
  pastMonths = 12,
  futureMonths = 6,
  label = 'Filter by Month',
  style
}: MonthFilterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (selectedMonth) {
      return parseInt(selectedMonth.split('-')[0]);
    }
    return new Date().getFullYear();
  });
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => {
    if (selectedMonth) {
      return parseInt(selectedMonth.split('-')[1]) - 1;
    }
    return new Date().getMonth();
  });

  // Generate available years
  const availableYears = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    const startYear = currentYear - Math.floor(pastMonths / 12) - 1;
    const endYear = currentYear + Math.floor(futureMonths / 12) + 1;
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years.sort((a, b) => b - a); // Most recent first
  }, [pastMonths, futureMonths]);

  // Check if a month is available
  const isMonthAvailable = React.useCallback((year: number, monthIndex: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const targetDate = new Date(year, monthIndex, 1);
    const minDate = new Date(currentYear, currentMonth - pastMonths, 1);
    const maxDate = new Date(currentYear, currentMonth + futureMonths, 1);
    
    return targetDate >= minDate && targetDate <= maxDate;
  }, [pastMonths, futureMonths]);

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      setSelectedYear(parseInt(year));
      setSelectedMonthIndex(parseInt(month) - 1);
    }
  }, [selectedMonth]);

  const handleMonthSelect = useCallback((year: number, monthIndex: number) => {
    const monthValue = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    console.log('📅 Month filter changed to:', monthValue);
    
    setSelectedYear(year);
    setSelectedMonthIndex(monthIndex);
    onMonthChange(monthValue);
    setShowPicker(false);
  }, [onMonthChange]);

  const formatDisplayDate = useCallback((year: number, monthIndex: number) => {
    return `${monthNames[monthIndex]} ${year}`;
  }, []);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.pickerButton, { 
          backgroundColor: colors.card,
          borderColor: colors.border 
        }]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.pickerButtonText, { color: colors.text }]}>
          {formatDisplayDate(selectedYear, selectedMonthIndex)}
        </Text>
        <Text style={[styles.pickerButtonIcon, { color: colors.textSecondary }]}>
          📅
        </Text>
      </TouchableOpacity>

      {/* Simple Month/Year Picker Modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)} />
          
          <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
            {/* Header */}
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: colors.text }]}>
                Select Month & Year
              </Text>
              <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.doneButton}>
                <Text style={[styles.doneButtonText, { color: colors.primary }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Year Selector */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Year</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearScrollView}>
              <View style={styles.yearContainer}>
                {availableYears.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearChip,
                      {
                        backgroundColor: selectedYear === year ? colors.primary : colors.background,
                        borderColor: selectedYear === year ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text
                      style={[
                        styles.yearChipText,
                        {
                          color: selectedYear === year ? '#ffffff' : colors.text,
                          fontWeight: selectedYear === year ? '600' : '500'
                        }
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Month Grid */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Month</Text>
            <View style={styles.monthGrid}>
              {monthNames.map((monthName, index) => {
                const isAvailable = isMonthAvailable(selectedYear, index);
                const isSelected = selectedMonthIndex === index;
                const isCurrent = new Date().getFullYear() === selectedYear && new Date().getMonth() === index;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthCell,
                      {
                        backgroundColor: isSelected 
                          ? colors.primary 
                          : isCurrent 
                            ? colors.background
                            : colors.card,
                        borderColor: isSelected 
                          ? colors.primary 
                          : isCurrent 
                            ? colors.primary
                            : colors.border,
                        borderWidth: isCurrent || isSelected ? 2 : 1,
                        opacity: isAvailable ? 1 : 0.4,
                      }
                    ]}
                    onPress={() => isAvailable && handleMonthSelect(selectedYear, index)}
                    disabled={!isAvailable}
                  >
                    <Text
                      style={[
                        styles.monthCellText,
                        {
                          color: isSelected 
                            ? '#ffffff' 
                            : isCurrent 
                              ? colors.primary
                              : colors.text,
                          fontWeight: isSelected || isCurrent ? '600' : '500'
                        }
                      ]}
                    >
                      {monthName.slice(0, 3)}
                    </Text>
                    
                    {/* Current month indicator */}
                    {isCurrent && !isSelected && (
                      <View style={[styles.currentDot, { backgroundColor: colors.primary }]} />
                    )}
                    
                    {/* Selected month checkmark */}
                    {isSelected && (
                      <Text style={styles.selectedCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Current Selection Display */}
            <View style={[styles.selectionFooter, { borderTopColor: colors.border }]}>
              <Text style={[styles.selectionText, { color: colors.textSecondary }]}>
                Selected: {formatDisplayDate(selectedYear, selectedMonthIndex)}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Show current selection */}
      <View style={styles.currentSelection}>
        <Text style={[styles.currentText, { color: colors.textSecondary }]}>
          Showing data for: {formatDisplayDate(selectedYear, selectedMonthIndex)}
        </Text>
      </View>
    </View>
  );
}

/**
 * Enhanced Month Filter with Picker Button
 */
interface MonthFilterWithPickerProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  pastMonths?: number;
  futureMonths?: number;
  label?: string;
  style?: any;
}

export function MonthFilterWithPicker({
  selectedMonth,
  onMonthChange,
  pastMonths = 24,
  futureMonths = 6,
  label = 'Select Month',
  style
}: MonthFilterWithPickerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showPicker, setShowPicker] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (selectedMonth) {
      return parseInt(selectedMonth.split('-')[0]);
    }
    return new Date().getFullYear();
  });
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => {
    if (selectedMonth) {
      return parseInt(selectedMonth.split('-')[1]) - 1;
    }
    return new Date().getMonth();
  });

  // Generate available years
  const availableYears = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    const startYear = currentYear - Math.floor(pastMonths / 12) - 1;
    const endYear = currentYear + Math.floor(futureMonths / 12) + 1;
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years.sort((a, b) => b - a); // Most recent first
  }, [pastMonths, futureMonths]);

  // Check if a month is available
  const isMonthAvailable = React.useCallback((year: number, monthIndex: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const targetDate = new Date(year, monthIndex, 1);
    const minDate = new Date(currentYear, currentMonth - pastMonths, 1);
    const maxDate = new Date(currentYear, currentMonth + futureMonths, 1);
    
    return targetDate >= minDate && targetDate <= maxDate;
  }, [pastMonths, futureMonths]);

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      setSelectedYear(parseInt(year));
      setSelectedMonthIndex(parseInt(month) - 1);
    }
  }, [selectedMonth]);

  const handleMonthSelect = useCallback(async (year: number, monthIndex: number) => {
    setIsChanging(true);
    try {
      const monthValue = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      console.log('📅 Month filter changed to:', monthValue);
      
      setSelectedYear(year);
      setSelectedMonthIndex(monthIndex);
      onMonthChange(monthValue);
      setShowPicker(false);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsChanging(false);
    }
  }, [onMonthChange]);

  const formatDisplayDate = useCallback((year: number, monthIndex: number) => {
    return `${monthNames[monthIndex]} ${year}`;
  }, []);

  return (
    <View style={[styles.filterWithPickerContainer, style]}>
      {label && (
        <Text style={[styles.filterLabel, { color: 'white' }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.enhancedPickerButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          }
        ]}
        onPress={() => setShowPicker(true)}
        disabled={isChanging}
      >
        <View style={styles.pickerButtonContent}>
          <Text style={[styles.pickerButtonText, { 
            color: isChanging ? colors.textSecondary : colors.text 
          }]}>
            {isChanging ? 'Loading...' : formatDisplayDate(selectedYear, selectedMonthIndex)}
          </Text>
          <Text style={[styles.pickerButtonIcon, { 
            color: colors.textSecondary,
            opacity: isChanging ? 0.5 : 1 
          }]}>
            {isChanging ? '⏳' : '📅'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Simple Month/Year Picker Modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)} />
          
          <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
            {/* Header */}
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: colors.text }]}>
                Select Month & Year
              </Text>
              <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.doneButton}>
                <Text style={[styles.doneButtonText, { color: colors.primary }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Year Selector */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Year</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearScrollView}>
              <View style={styles.yearContainer}>
                {availableYears.map(year => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearChip,
                      {
                        backgroundColor: selectedYear === year ? colors.primary : colors.background,
                        borderColor: selectedYear === year ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text
                      style={[
                        styles.yearChipText,
                        {
                          color: selectedYear === year ? '#ffffff' : colors.text,
                          fontWeight: selectedYear === year ? '600' : '500'
                        }
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Month Grid */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Month</Text>
            <View style={styles.monthGrid}>
              {monthNames.map((monthName, index) => {
                const isAvailable = isMonthAvailable(selectedYear, index);
                const isSelected = selectedMonthIndex === index;
                const isCurrent = new Date().getFullYear() === selectedYear && new Date().getMonth() === index;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthCell,
                      {
                        backgroundColor: isSelected 
                          ? colors.primary 
                          : isCurrent 
                            ? colors.background
                            : colors.card,
                        borderColor: isSelected 
                          ? colors.primary 
                          : isCurrent 
                            ? colors.primary
                            : colors.border,
                        borderWidth: isCurrent || isSelected ? 2 : 1,
                        opacity: isAvailable ? 1 : 0.4,
                      }
                    ]}
                    onPress={() => isAvailable && handleMonthSelect(selectedYear, index)}
                    disabled={!isAvailable}
                  >
                    <Text
                      style={[
                        styles.monthCellText,
                        {
                          color: isSelected 
                            ? '#ffffff' 
                            : isCurrent 
                              ? colors.primary
                              : colors.text,
                          fontWeight: isSelected || isCurrent ? '600' : '500'
                        }
                      ]}
                    >
                      {monthName.slice(0, 3)}
                    </Text>
                    
                    {/* Current month indicator */}
                    {isCurrent && !isSelected && (
                      <View style={[styles.currentDot, { backgroundColor: colors.primary }]} />
                    )}
                    
                    {/* Selected month checkmark */}
                    {isSelected && (
                      <Text style={styles.selectedCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Current Selection Display */}
            <View style={[styles.selectionFooter, { borderTopColor: colors.border }]}>
              <Text style={[styles.selectionText, { color: colors.textSecondary }]}>
                Selected: {formatDisplayDate(selectedYear, selectedMonthIndex)}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/**
 * Legacy MonthPicker export for backward compatibility
 */
export function MonthPicker(props: MonthFilterWithPickerProps) {
  return <MonthFilterWithPicker {...props} />;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerButtonText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  pickerButtonIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  currentSelection: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  currentText: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },

  // Enhanced Picker Button Styles
  filterWithPickerContainer: {
    marginVertical: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  enhancedPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pickerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerContainer: {
    width: '92%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 22,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  doneButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 10,
  },
  yearScrollView: {
    marginBottom: 10,
  },
  yearContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 4,
  },
  yearChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  yearChipText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Month Grid
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  monthCell: {
    width: '30%',
    aspectRatio: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  monthCellText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  currentDot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  selectedCheck: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Selection Footer
  selectionFooter: {
    paddingTop: 14,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
});

export default MonthFilter;
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { DropdownOption } from '../types';

interface Props {
  label: string;
  options: DropdownOption[];
  selected: DropdownOption | null;
  onSelect: (option: DropdownOption) => void;
}

export const Dropdown = ({ label, options, selected, onSelect }: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={[styles.buttonText, !selected && styles.placeholder]}>
          {selected?.label || 'Selecione'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selected?.value === item.value && styles.selectedOption
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  <Text style={styles.optionValue}>({item.value})</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    flex: 1,
  },
  placeholder: {
    color: '#9ca3af',
  },
  arrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  optionValue: {
    fontSize: 14,
    color: '#6b7280',
  },
});
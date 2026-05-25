import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface Props {
  visible: boolean;
  onConfirm: (inspectorName: string, inspectorRole: string) => void;
  onCancel: () => void;
}

export const FinalizationModal = ({ visible, onConfirm, onCancel }: Props) => {
  const [inspectorName, setInspectorName] = useState('');
  const [inspectorRole, setInspectorRole] = useState('');

  const handleConfirm = () => {
    if (inspectorName.trim() && inspectorRole.trim()) {
      onConfirm(inspectorName, inspectorRole);
      setInspectorName('');
      setInspectorRole('');
    }
  };

  const handleCancel = () => {
    setInspectorName('');
    setInspectorRole('');
    onCancel();
  };

  const isValid = inspectorName.trim() && inspectorRole.trim();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Finalizar Inspeção</Text>
          <Text style={styles.subtitle}>
            Informe os dados do inspetor responsável
          </Text>

          <Text style={styles.label}>Nome do Inspetor</Text>
          <TextInput
            style={styles.input}
            value={inspectorName}
            onChangeText={setInspectorName}
            placeholder="Nome completo"
          />

          <Text style={styles.label}>Cargo do Inspetor</Text>
          <TextInput
            style={styles.input}
            value={inspectorRole}
            onChangeText={setInspectorRole}
            placeholder="Cargo ou função"
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, !isValid && styles.disabled]}
              onPress={handleConfirm}
              disabled={!isValid}
            >
              <Text style={styles.confirmText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

interface Props {
  visible: boolean;
  onConfirm: (inspectorName: string, inspectorRole: string, signature: string) => void;
  onCancel: () => void;
}

export const FinalizationModal = ({ visible, onConfirm, onCancel }: Props) => {
  const [inspectorName, setInspectorName] = useState('');
  const [inspectorRole, setInspectorRole] = useState('');
  const [signature, setSignature] = useState<string | null>(null);

  const signatureRef = useRef<any>(null);

  const handleSignature = (sig: string) => {
    setSignature(sig);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignature(null);
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  const handleConfirm = () => {
    if (inspectorName.trim() && inspectorRole.trim() && signature) {
      onConfirm(inspectorName, inspectorRole, signature);

      setInspectorName('');
      setInspectorRole('');
      setSignature(null);

      signatureRef.current?.clearSignature();
    }
  };

  const handleCancel = () => {
    setInspectorName('');
    setInspectorRole('');
    setSignature(null);

    signatureRef.current?.clearSignature();

    onCancel();
  };

  const isValid =
    inspectorName.trim() &&
    inspectorRole.trim() &&
    signature;

  const webStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
    }

    .m-signature-pad--body {
      border: none;
    }

    .m-signature-pad--footer {
      display: none;
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      touch-action: none;
    }

    canvas {
      width: 100% !important;
      height: 100% !important;
      touch-action: none;
    }
  `;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Finalizar Inspeção</Text>

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

          <Text style={styles.label}>Assinatura</Text>

          <View style={styles.signatureContainer}>
            <SignatureCanvas
              ref={signatureRef}
              onOK={handleSignature}
              onEnd={handleEnd}
              webStyle={webStyle}
              descriptionText=""
              clearText=""
              confirmText=""
              autoClear={false}
              backgroundColor="#fff"
              penColor="#000"
            />
          </View>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>

          {!signature && (
            <Text style={styles.warning}>
              Assinatura obrigatória
            </Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !isValid && styles.disabled,
              ]}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  modal: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  signatureContainer: {
    height: 200,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: 8,
  },

  clearButton: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
  },

  clearText: {
    color: '#3b82f6',
    fontWeight: '600',
  },

  warning: {
    marginTop: 10,
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 12,
  },

  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },

  cancelText: {
    fontWeight: '600',
    color: '#666',
  },

  confirmButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },

  disabled: {
    opacity: 0.5,
  },

  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
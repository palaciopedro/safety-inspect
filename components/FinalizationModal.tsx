import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

interface Props {
  visible: boolean;
  onConfirm: (
    auditorName: string,
    auditorRole: string,
    auditorSignature: string,
    responsibleName: string,
    responsibleRole: string,
    responsibleSignature: string
  ) => void;
  onCancel: () => void;
}

export const FinalizationModal = ({ visible, onConfirm, onCancel }: Props) => {
  const [auditorName, setAuditorName] = useState('');
  const [auditorRole, setAuditorRole] = useState('');
  const [auditorSignature, setAuditorSignature] = useState<string | null>(null);

  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleRole, setResponsibleRole] = useState('');
  const [responsibleSignature, setResponsibleSignature] = useState<string | null>(null);

  const signatureRefAuditor = useRef<any>(null);
  const signatureRefResponsible = useRef<any>(null);

  const handleSignatureAuditor = (sig: string) => {
    setAuditorSignature(sig);
  };

  const handleSignatureResponsible = (sig: string) => {
    setResponsibleSignature(sig);
  };

  const handleClear = () => {
    signatureRefAuditor.current?.clearSignature();
    signatureRefResponsible.current?.clearSignature();
    setAuditorSignature(null);
    setResponsibleSignature(null);
  };

  const [step, setStep] = useState<number>(1);

  const handleClearAuditor = () => {
    signatureRefAuditor.current?.clearSignature();
    setAuditorSignature(null);
  };

  const handleAdvance = () => {
    // preserve auditorSignature value but clear the canvas display
    signatureRefAuditor.current?.clearSignature();
    setStep(2);
  };

  const handleClearResponsible = () => {
    signatureRefResponsible.current?.clearSignature();
    setResponsibleSignature(null);
  };

  const handleEndAuditor = () => {
    signatureRefAuditor.current?.readSignature();
  };

  const handleEndResponsible = () => {
    signatureRefResponsible.current?.readSignature();
  };

  const handleConfirm = () => {
    if (
      auditorName.trim() &&
      auditorRole.trim() &&
      auditorSignature &&
      responsibleName.trim() &&
      responsibleRole.trim() &&
      responsibleSignature
    ) {
      onConfirm(
        auditorName,
        auditorRole,
        auditorSignature,
        responsibleName,
        responsibleRole,
        responsibleSignature
      );

      setAuditorName('');
      setAuditorRole('');
      setAuditorSignature(null);
      setResponsibleName('');
      setResponsibleRole('');
      setResponsibleSignature(null);

      signatureRefAuditor.current?.clearSignature();
      signatureRefResponsible.current?.clearSignature();
    }
  };

  const handleCancel = () => {
    setAuditorName('');
    setAuditorRole('');
    setAuditorSignature(null);
    setResponsibleName('');
    setResponsibleRole('');
    setResponsibleSignature(null);

    signatureRefAuditor.current?.clearSignature();
    signatureRefResponsible.current?.clearSignature();

    onCancel();
  };

  const isValid =
    auditorName.trim() &&
    auditorRole.trim() &&
    auditorSignature &&
    responsibleName.trim() &&
    responsibleRole.trim() &&
    responsibleSignature;

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

          {step === 1 ? (
            <>
              <Text style={styles.label}>Nome do Auditor SST</Text>
              <TextInput
                style={styles.input}
                value={auditorName}
                onChangeText={setAuditorName}
                placeholder="Nome completo"
              />

              <Text style={styles.label}>Cargo do Auditor SST</Text>
              <TextInput
                style={styles.input}
                value={auditorRole}
                onChangeText={setAuditorRole}
                placeholder="Cargo ou função"
              />

              <Text style={styles.label}>Assinatura do Auditor SST</Text>

              <View style={styles.signatureContainer}>
                <SignatureCanvas
                  ref={signatureRefAuditor}
                  onOK={handleSignatureAuditor}
                  onEnd={handleEndAuditor}
                  webStyle={webStyle}
                  descriptionText=""
                  clearText=""
                  confirmText=""
                  autoClear={false}
                  backgroundColor="#fff"
                  penColor="#000"
                />
              </View>

              <TouchableOpacity style={styles.clearButton} onPress={handleClearAuditor}>
                <Text style={styles.clearText}>Limpar</Text>
              </TouchableOpacity>

              {(!auditorSignature || !auditorName.trim() || !auditorRole.trim()) && (
                <Text style={styles.warning}>Preencha nome, cargo e assinatura do Auditor</Text>
              )}

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton, (!auditorSignature || !auditorName.trim() || !auditorRole.trim()) && styles.disabled]}
                  onPress={handleAdvance}
                  disabled={!auditorSignature || !auditorName.trim() || !auditorRole.trim()}
                >
                  <Text style={styles.confirmText}>Avançar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Nome do Responsável pelo Local</Text>
              <TextInput
                style={styles.input}
                value={responsibleName}
                onChangeText={setResponsibleName}
                placeholder="Nome completo"
              />

              <Text style={styles.label}>Cargo do Responsável pelo Local</Text>
              <TextInput
                style={styles.input}
                value={responsibleRole}
                onChangeText={setResponsibleRole}
                placeholder="Cargo ou função"
              />

              <Text style={styles.label}>Assinatura do Responsável pelo Local</Text>

              <View style={styles.signatureContainer}>
                <SignatureCanvas
                  ref={signatureRefResponsible}
                  onOK={handleSignatureResponsible}
                  onEnd={handleEndResponsible}
                  webStyle={webStyle}
                  descriptionText=""
                  clearText=""
                  confirmText=""
                  autoClear={false}
                  backgroundColor="#fff"
                  penColor="#000"
                />
              </View>

              <TouchableOpacity style={styles.clearButton} onPress={handleClearResponsible}>
                <Text style={styles.clearText}>Limpar</Text>
              </TouchableOpacity>

              {(!responsibleSignature || !responsibleName.trim() || !responsibleRole.trim()) && (
                <Text style={styles.warning}>Preencha nome, cargo e assinatura do Responsável</Text>
              )}

              <View style={styles.buttons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setStep(1)}>
                  <Text style={styles.cancelText}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton, (!responsibleSignature || !responsibleName.trim() || !responsibleRole.trim()) && styles.disabled]}
                  onPress={handleConfirm}
                  disabled={!responsibleSignature || !responsibleName.trim() || !responsibleRole.trim()}
                >
                  <Text style={styles.confirmText}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
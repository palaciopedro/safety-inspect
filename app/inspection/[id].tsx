import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Inspection, Finding } from '../../types';
import { FindingCard } from '../../components/FindingCard';
import { FinalizationModal } from '../../components/FinalizationModal';
import { db } from '../../services/database';
import { formatDateBR } from '../../utils/date';
import { generateAndShareReport } from '../../services/report';
import { generateAndShareCSV } from '../../services/csv';

export default function InspectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [showFinalizationModal, setShowFinalizationModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [id])
  );

  const loadData = async () => {
    try {
      const [insp, finds] = await Promise.all([
        db.inspections.getById(id),
        db.findings.listByInspection(id),
      ]);
      setInspection(insp);
      setFindings(finds);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalize = (inspectorName: string, inspectorRole: string, signature: string) => {
    finalize(inspectorName, inspectorRole, signature);
  };

  const finalize = async (inspectorName: string, inspectorRole: string, signature: string) => {
    try {
      await db.inspections.update(id, {
        status: 'completed',
        inspector_name: inspectorName,
        inspector_role: inspectorRole,
        inspector_signature: signature,
      });
      setShowFinalizationModal(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFinding = async (findingId: string) => {
    try {
      await db.findings.delete(findingId);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = async () => {
    if (!inspection) return;
    try {
      await generateAndShareReport(inspection, findings);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gerar relatório');
      console.error(error);
    }
  };

  const handleExcel = async () => {
    if (!inspection) return;
    try {
      await generateAndShareCSV(inspection, findings);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar planilha');
      console.error(error);
    }
  };

  if (!inspection) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.unit}>{inspection.unit}</Text>
        <Text style={styles.date}>{formatDateBR(inspection.date)}</Text>
        {inspection.inspector_name && (
          <>
            <Text style={styles.inspector}>
              Inspetor: {inspection.inspector_name} - {inspection.inspector_role}
            </Text>
            {inspection.inspector_signature && (
              <View style={styles.signaturePreview}>
                <Text style={styles.signatureLabel}>Assinatura:</Text>
                <Image
                  source={{ uri: inspection.inspector_signature }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/new-finding?inspectionId=${id}`)}
        >
          <Text style={styles.buttonText}>Adicionar Ocorrência</Text>
        </TouchableOpacity>
        
        {inspection.status === 'draft' && (
          <TouchableOpacity
            style={[styles.button, styles.complete]}
            onPress={() => setShowFinalizationModal(true)}
          >
            <Text style={styles.buttonText}>Finalizar</Text>
          </TouchableOpacity>
        )}

        {inspection.status === 'completed' && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.report]}
              onPress={handleReport}
            >
              <Text style={styles.buttonText}>Baixar Relatório</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.excel]}
              onPress={handleExcel}
            >
              <Text style={styles.buttonText}>Exportar Planilha</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <FlatList
        data={findings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FindingCard finding={item} onDelete={() => handleDeleteFinding(item.id)} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma ocorrência registrada</Text>
        }
      />

      <FinalizationModal
        visible={showFinalizationModal}
        onConfirm={handleFinalize}
        onCancel={() => setShowFinalizationModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  unit: {
    fontSize: 20,
    fontWeight: '700',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  inspector: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  signaturePreview: {
    marginTop: 12,
    gap: 4,
  },
  signatureLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  signatureImage: {
    width: 200,
    height: 80,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  complete: {
    backgroundColor: '#22c55e',
  },
  report: {
    backgroundColor: '#7c3aed',
  },
  excel: {
    backgroundColor: '#1a6b2f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
});
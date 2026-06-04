import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Inspection, Finding } from '../../types';
import { FindingCard } from '../../components/FindingCard';
import { FinalizationModal } from '../../components/FinalizationModal';
import { AppModal } from '../../components/AppModal';
import { db } from '../../services/database';
import { formatDateBR } from '../../utils/date';
import { generateAndShareReport } from '../../services/report';
import { generateAndShareCSV } from '../../services/csv';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InspectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [showFinalizationModal, setShowFinalizationModal] = useState(false);
  const [appModalVisible, setAppModalVisible] = useState(false);
  const [appModalConfig, setAppModalConfig] = useState<any>(null);

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

  const handleFinalize = (
    auditorName: string,
    auditorRole: string,
    auditorSignature: string,
    responsibleName: string,
    responsibleRole: string,
    responsibleSignature: string
  ) => {
    finalize(
      auditorName,
      auditorRole,
      auditorSignature,
      responsibleName,
      responsibleRole,
      responsibleSignature
    );
  };

  const finalize = async (
    auditorName: string,
    auditorRole: string,
    auditorSignature: string,
    responsibleName: string,
    responsibleRole: string,
    responsibleSignature: string
  ) => {
    try {
      await db.inspections.update(id, {
        status: 'completed',
        inspector_name: auditorName,
        inspector_role: auditorRole,
        inspector_signature: auditorSignature,
        responsible_name: responsibleName,
        responsible_role: responsibleRole,
        responsible_signature: responsibleSignature,
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

  const hasFindings = findings.length > 0;

  const handleReport = async () => {
    if (!inspection) return;
    try {
      await generateAndShareReport(inspection, findings);
    } catch (error) {
      setAppModalConfig({
        title: 'Erro',
        message: 'Falha ao gerar relatório',
        type: 'danger',
        confirmText: 'OK',
      });
      setAppModalVisible(true);
      console.error(error);
    }
  };

  const handleCSV = async () => {
    if (!inspection) return;
    try {
      await generateAndShareCSV(inspection, findings);
    } catch (error) {
      setAppModalConfig({
        title: 'Erro',
        message: 'Falha ao exportar planilha',
        type: 'danger',
        confirmText: 'OK',
      });
      setAppModalVisible(true);
      console.error(error);
    }
  };

  if (!inspection) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0F4C81', '#1A6BA8', '#4CAF50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{inspection.unit}</Text>
          <Text style={styles.headerSubtitle}>{formatDateBR(inspection.date)}</Text>
        </View>
      </LinearGradient>

      {inspection.status === 'completed' && inspection.inspector_name && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Auditor</Text>
          <Text style={styles.summaryText}>{inspection.inspector_name}</Text>
          <Text style={styles.summarySubText}>{inspection.inspector_role}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.addFindingButton]}
          onPress={() => router.push(`/new-finding?inspectionId=${id}`)}
        >
          <View style={styles.actionButtonContent}>
            <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Adicionar Ocorrência</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.sideActionButton,
              styles.reportButton,
              inspection.status !== 'completed' && styles.disabledButton,
            ]}
            onPress={handleReport}
            disabled={inspection.status !== 'completed'}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="document-text-outline" size={22} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Baixar Relatório</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sideActionButton,
              styles.csvButton,
              inspection.status !== 'completed' && styles.disabledButton,
            ]}
            onPress={handleCSV}
            disabled={inspection.status !== 'completed'}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="download-outline" size={22} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Exportar CSV</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {inspection.status === 'draft' && (
        <View style={styles.finalizeWrapper}>
          <TouchableOpacity
            style={[styles.finalizeButton, !hasFindings && styles.disabledButton]}
            onPress={() => hasFindings ? setShowFinalizationModal(true) : null}
            disabled={!hasFindings}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
              <Text style={styles.finalizeButtonText}>Finalizar Inspeção</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={findings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FindingCard
            finding={item}
            onDelete={() => handleDeleteFinding(item.id)}
            onEdit={() => router.push(`/new-finding?inspectionId=${id}&findingId=${item.id}`)}
          />
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

      <AppModal
        visible={appModalVisible}
        title={appModalConfig?.title || ''}
        message={appModalConfig?.message || ''}
        type={appModalConfig?.type || 'info'}
        confirmText={appModalConfig?.confirmText || 'OK'}
        onConfirm={() => setAppModalVisible(false)}
        isConfirmOnly={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerBack: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summarySubText: {
    fontSize: 14,
    color: '#4B5563',
  },
  actions: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  actionButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  addFindingButton: {
    backgroundColor: '#0F4C81',
  },
  reportButton: {
    backgroundColor: '#E53935',
  },
  csvButton: {
    backgroundColor: '#2E7D32',
  },
  sideActionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  disabledButton: {
    opacity: 0.55,
  },
  finalizeWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: 14,
  },
  finalizeButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  finalizeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 150,
  },
});

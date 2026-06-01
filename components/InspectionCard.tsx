import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Inspection } from '../types';
import { formatDateBR } from '../utils/date';
import { db } from '../services/database';
import { useState, useEffect } from 'react';

interface Props {
  inspection: Inspection;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const statusLabels = {
  draft: 'Em andamento',
  completed: 'Finalizada',
};

export const InspectionCard = ({ inspection, onPress, onDelete, onEdit }: Props) => {
  const [findingsCount, setFindingsCount] = useState(0);

  useEffect(() => {
    const loadFindingsCount = async () => {
      try {
        const findings = await db.findings.listByInspection(inspection.id);
        setFindingsCount(findings.length);
      } catch (error) {
        console.error(error);
      }
    };
    loadFindingsCount();
  }, [inspection.id]);

  const handleDelete = () => {
    Alert.alert(
      'Excluir Inspeção',
      'Tem certeza que deseja excluir esta inspeção? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete }
      ]
    );
  };

  const isCompleted = inspection.status === 'completed';
  const statusBgColor = isCompleted ? '#DCFCE7' : '#DBEAFE';
  const statusTextColor = isCompleted ? '#15803D' : '#1D4ED8';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.unit}>{inspection.unit}</Text>
          <View style={[styles.status, { backgroundColor: statusBgColor }]}>
            <Text style={[styles.statusText, { color: statusTextColor }]}>
              {statusLabels[inspection.status]}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <Ionicons name="create-outline" size={20} color="#0F4C81" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => { e.stopPropagation(); handleDelete(); }}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>{formatDateBR(inspection.date)}</Text>
        </View>

        {findingsCount > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="clipboard-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{findingsCount} ocorrência{findingsCount !== 1 ? 's' : ''} registrada{findingsCount !== 1 ? 's' : ''}</Text>
          </View>
        )}

        {inspection.inspector_name && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>Auditor SST: {inspection.inspector_name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unit: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  info: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
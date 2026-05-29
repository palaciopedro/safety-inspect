import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Inspection } from '../types';
import { Svg, Path, Rect } from 'react-native-svg';
import { formatDateBR } from '../utils/date';

interface Props {
  inspection: Inspection;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const statusLabels = {
  draft: 'Rascunho',
  completed: 'Finalizada',
};

const TrashIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="#ef4444">
    <Path d="M3 6h18v2H3V6zm2 3h14l-1 13H6L5 9zm5-6h4v1H10V3z"/>
    <Rect x="8" y="10" width="2" height="8"/>
    <Rect x="11" y="10" width="2" height="8"/>
    <Rect x="14" y="10" width="2" height="8"/>
  </Svg>
);

const PencilIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="#eab308">
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </Svg>
);

export const InspectionCard = ({ inspection, onPress, onDelete, onEdit }: Props) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.unit}>{inspection.unit}</Text>
        <View style={[styles.status, inspection.status === 'completed' && styles.completed]}>
          <Text style={styles.statusText}>{statusLabels[inspection.status]}</Text>
        </View>
      </View>
      <Text style={styles.date}>{formatDateBR(inspection.date)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={(e) => { e.stopPropagation(); onEdit(); }}
        >
          <PencilIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={(e) => { e.stopPropagation(); handleDelete(); }}
        >
          <TrashIcon />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unit: { fontSize: 16, fontWeight: '600', flex: 1 },
  status: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 4, backgroundColor: '#f3f4f6',
  },
  completed: { backgroundColor: '#dcfce7' },
  statusText: { fontSize: 12, fontWeight: '500' },
  date: { fontSize: 14, color: '#666' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  iconButton: { padding: 4 },
});
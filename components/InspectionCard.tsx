import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Inspection } from '../types';

interface Props {
  inspection: Inspection;
  onPress: () => void;
}

export const InspectionCard = ({ inspection, onPress }: Props) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.header}>
      <Text style={styles.unit}>{inspection.unit}</Text>
      <View style={[styles.status, inspection.status === 'completed' && styles.completed]}>
        <Text style={styles.statusText}>{inspection.status}</Text>
      </View>
    </View>
    <Text style={styles.date}>{new Date(inspection.date).toLocaleDateString()}</Text>
  </TouchableOpacity>
);

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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  completed: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});
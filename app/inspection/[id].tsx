import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Inspection, Finding } from '../../types';
import { FindingCard } from '../../components/FindingCard';
import { db } from '../../services/database';

export default function InspectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [insp, finds] = await Promise.all([
        db.inspections.list(),
        db.findings.listByInspection(id),
      ]);
      setInspection(insp.find(i => i.id === id) || null);
      setFindings(finds);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async () => {
    try {
      await db.inspections.update(id, { status: 'completed' });
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

  if (!inspection) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.unit}>{inspection.unit}</Text>
        <Text style={styles.date}>{new Date(inspection.date).toLocaleDateString('pt-BR')}</Text>
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
            onPress={handleComplete}
          >
            <Text style={styles.buttonText}>Finalizar</Text>
          </TouchableOpacity>
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
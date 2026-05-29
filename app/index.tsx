import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Inspection } from '../types';
import { InspectionCard } from '../components/InspectionCard';
import { db } from '../services/database';

export default function Home() {
  const router = useRouter();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadInspections();
    }, [])
  );

  const loadInspections = async () => {
    try {
      const data = await db.inspections.list();
      setInspections(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await db.inspections.delete(id);
      loadInspections();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspeções</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/new-inspection')}
        >
          <Text style={styles.buttonText}>Nova Inspeção</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={inspections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <InspectionCard
            inspection={item}
            onPress={() => router.push(`/inspection/${item.id}`)}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => router.push(`/new-inspection?id=${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadInspections}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    gap: 12,
  },
});
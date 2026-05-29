import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../services/database';
import { getCurrentDateLocal } from '../utils/date';

export default function NewInspection() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(getCurrentDateLocal());

  useEffect(() => {
    if (!id) return;
    db.inspections.getById(id).then(inspection => {
      setUnit(inspection.unit);
      setDate(inspection.date);
    }).catch(console.error);
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await db.inspections.update(id!, { unit, date });
      } else {
        await db.inspections.create({ unit, date, status: 'draft' });
      }
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const isValid = unit.trim().length > 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Unidade</Text>
      <TextInput
        style={styles.input}
        value={unit}
        onChangeText={setUnit}
        placeholder="Ex: Campo Mourão"
      />

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="AAAA-MM-DD"
      />

      <TouchableOpacity
        style={[styles.button, !isValid && styles.disabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'Salvar alterações' : 'Adicionar inspeção'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 8, padding: 12, fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6', padding: 16, borderRadius: 8,
    alignItems: 'center', marginTop: 24,
  },
  disabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../services/database';
import { getCurrentDateLocal } from '../../utils/date';

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F4C81', '#1A6BA8', '#4CAF50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Inspeção</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="clipboard-outline" size={24} color="#0F4C81" />
            <Text style={styles.sectionTitle}>Dados da Inspeção</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Unidade</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={unit}
                onChangeText={setUnit}
                placeholder="Ex: Campo Mourão"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Data</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}> 
        <TouchableOpacity
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={[styles.submitButtonText, !isValid && styles.disabledText]}>Criar Inspeção</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F5F7FA',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#D1FAE5',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.65,
  },
});
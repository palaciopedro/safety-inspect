import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Probability, Impact } from '../types';
import { RiskMatrix } from '../components/RiskMatrix';
import { RiskBadge } from '../components/RiskBadge';
import { calculateRisk } from '../utils/risk';
import { db } from '../services/database';

export default function NewFinding() {
  const { inspectionId } = useLocalSearchParams<{ inspectionId: string }>();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [risk, setRisk] = useState<{ probability: Probability; impact: Impact } | null>(null);

  const handleSubmit = async () => {
    if (!risk) return;
    
    try {
      await db.findings.create({
        inspection_id: inspectionId,
        description,
        probability: risk.probability,
        impact: risk.impact,
        risk_level: calculateRisk(risk.probability, risk.impact),
      });
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const isValid = description && risk;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva a ocorrência de segurança"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Matriz de Risco</Text>
      <RiskMatrix
        selected={risk || undefined}
        onSelect={(probability, impact) => setRisk({ probability, impact })}
      />

      {risk && (
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Nível de Risco:</Text>
          <RiskBadge level={calculateRisk(risk.probability, risk.impact)} />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, !isValid && styles.disabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Salvar Ocorrência</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
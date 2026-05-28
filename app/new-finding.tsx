import { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DropdownOption } from '../types';
import { Dropdown } from '../components/Dropdown';
import { RiskBadge } from '../components/RiskBadge';
import { PhotoPicker } from '../components/PhotoPicker';
import { calculateRiskScore, getRiskLevel } from '../utils/risk';
import { db } from '../services/database';
import {
  GRAVITY_OPTIONS,
  FREQUENCY_OPTIONS,
  PROBABILITY_OPTIONS,
  EXPOSURE_OPTIONS,
} from '../constants/dropdownOptions';

export default function NewFinding() {
  const { inspectionId } = useLocalSearchParams<{ inspectionId: string }>();
  const router = useRouter();

  const [riskDescription, setRiskDescription] = useState('');
  const [whatToDo, setWhatToDo] = useState('');
  const [whyToDo, setWhyToDo] = useState('');
  const [gravity, setGravity] = useState<DropdownOption | null>(null);
  const [frequency, setFrequency] = useState<DropdownOption | null>(null);
  const [probability, setProbability] = useState<DropdownOption | null>(null);
  const [exposure, setExposure] = useState<DropdownOption | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const calculatedScore = useMemo(() => {
    if (!gravity || !frequency || !probability || !exposure) return 0;
    return calculateRiskScore(gravity.value, frequency.value, probability.value, exposure.value);
  }, [gravity, frequency, probability, exposure]);

  const riskLevel = useMemo(() => getRiskLevel(calculatedScore), [calculatedScore]);

  const handleSubmit = async () => {
    if (!gravity || !frequency || !probability || !exposure) return;
    try {
      await db.findings.create({
        inspection_id: inspectionId,
        risk_description: riskDescription,
        what_to_do: whatToDo,
        why_to_do: whyToDo,
        gravity_label: gravity.label,
        gravity_value: gravity.value,
        frequency_label: frequency.label,
        frequency_value: frequency.value,
        probability_label: probability.label,
        probability_value: probability.value,
        exposure_label: exposure.label,
        exposure_value: exposure.value,
        calculated_score: calculatedScore,
        risk_level: riskLevel,
        photos,
      });
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const isValid =
    riskDescription.trim() &&
    whatToDo.trim() &&
    whyToDo.trim() &&
    gravity && frequency && probability && exposure &&
    photos.length > 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Descrição do Risco</Text>
      <TextInput
        style={styles.multiline}
        value={riskDescription}
        onChangeText={setRiskDescription}
        placeholder="Descreva o risco identificado"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Text style={styles.label}>O Que Tem Que Ser Feito</Text>
      <TextInput
        style={styles.multiline}
        value={whatToDo}
        onChangeText={setWhatToDo}
        placeholder="Ações necessárias"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Por Que Tem Que Ser Feito</Text>
      <TextInput
        style={styles.multiline}
        value={whyToDo}
        onChangeText={setWhyToDo}
        placeholder="Justificativa"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Dropdown label="Gravidade" options={GRAVITY_OPTIONS} selected={gravity} onSelect={setGravity} />
      <View style={styles.spacer} />
      <Dropdown label="Frequência" options={FREQUENCY_OPTIONS} selected={frequency} onSelect={setFrequency} />
      <View style={styles.spacer} />
      <Dropdown label="Probabilidade" options={PROBABILITY_OPTIONS} selected={probability} onSelect={setProbability} />
      <View style={styles.spacer} />
      <Dropdown label="Exposição" options={EXPOSURE_OPTIONS} selected={exposure} onSelect={setExposure} />

      <PhotoPicker photos={photos} onPhotosChange={setPhotos} />

      {calculatedScore > 0 && (
        <View style={styles.result}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Pontuação:</Text>
            <Text style={styles.resultScore}>{calculatedScore.toFixed(2)}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Nível de Risco:</Text>
            <RiskBadge level={riskLevel} />
          </View>
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
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  multiline: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 8, padding: 12, fontSize: 16, minHeight: 80,
  },
  spacer: { height: 16 },
  result: {
    backgroundColor: '#fff', padding: 16, borderRadius: 8,
    gap: 12, marginTop: 24, borderWidth: 1, borderColor: '#e5e7eb',
  },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { fontSize: 16, fontWeight: '600' },
  resultScore: { fontSize: 18, fontWeight: '700', color: '#3b82f6' },
  button: {
    backgroundColor: '#3b82f6', padding: 16, borderRadius: 8,
    alignItems: 'center', marginTop: 24, marginBottom: 32,
  },
  disabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
import { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewFinding() {
  const { inspectionId, findingId } = useLocalSearchParams<{
    inspectionId: string;
    findingId?: string;
  }>();
  const router = useRouter();
  const isEditing = !!findingId;

  const [riskDescription, setRiskDescription] = useState('');
  const [sector, setSector] = useState('');
  const [whatToDo, setWhatToDo] = useState('');
  const [whyToDo, setWhyToDo] = useState('');
  const [legalRequirement, setLegalRequirement] = useState('');
  const [gravity, setGravity] = useState<DropdownOption | null>(null);
  const [frequency, setFrequency] = useState<DropdownOption | null>(null);
  const [probability, setProbability] = useState<DropdownOption | null>(null);
  const [exposure, setExposure] = useState<DropdownOption | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!findingId) return;
    db.findings.getById(findingId).then(f => {
      setRiskDescription(f.risk_description);
      setSector(f.sector);
      setWhatToDo(f.what_to_do);
      setWhyToDo(f.why_to_do);
      setLegalRequirement(f.legal_requirement ?? '');
      setGravity({ label: f.gravity_label, value: f.gravity_value });
      setFrequency({ label: f.frequency_label, value: f.frequency_value });
      setProbability({ label: f.probability_label, value: f.probability_value });
      setExposure({ label: f.exposure_label, value: f.exposure_value });
      setPhotos(f.photos ?? []);
    }).catch(console.error);
  }, [findingId]);

  const calculatedScore = useMemo(() => {
    if (!gravity || !frequency || !probability || !exposure) return 0;
    return calculateRiskScore(gravity.value, frequency.value, probability.value, exposure.value);
  }, [gravity, frequency, probability, exposure]);

  const riskLevel = useMemo(() => getRiskLevel(calculatedScore), [calculatedScore]);

  const handleSubmit = async () => {
    if (!gravity || !frequency || !probability || !exposure) return;
    const payload = {
      inspection_id: inspectionId,
      risk_description: riskDescription,
      sector,
      what_to_do: whatToDo,
      why_to_do: whyToDo,
      legal_requirement: legalRequirement,
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
    };

    try {
      if (isEditing) {
        await db.findings.update(findingId!, payload);
      } else {
        await db.findings.create(payload);
      }
      router.replace(`/inspection/${inspectionId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const isValid =
    riskDescription.trim() &&
    sector.trim() &&
    whatToDo.trim() &&
    whyToDo.trim() &&
    legalRequirement.trim() &&
    gravity && frequency && probability && exposure &&
    photos.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0F4C81", "#1A6BA8", "#4CAF50"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Ocorrência</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Card 1 - Informações Gerais */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="layers-outline" size={22} color="#0F4C81" />
            <Text style={styles.sectionTitle}>Informações Gerais</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Setor</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={sector}
                onChangeText={setSector}
                placeholder="Setor responsável"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Requisito Legal</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={legalRequirement}
                onChangeText={setLegalRequirement}
                placeholder="Ex: NR-15"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Card 2 - Descrições */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning-outline" size={22} color="#0F4C81" />
            <Text style={styles.sectionTitle}>Descrição e Ações</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descrição do Risco</Text>
            <View style={styles.inputWrapperMultiline}>
              <TextInput
                style={styles.multiline}
                value={riskDescription}
                onChangeText={setRiskDescription}
                placeholder="Descreva o risco identificado"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>O Que Tem Que Ser Feito</Text>
            <View style={styles.inputWrapperMultiline}>
              <TextInput
                style={styles.multiline}
                value={whatToDo}
                onChangeText={setWhatToDo}
                placeholder="Ações necessárias"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Por Que Tem Que Ser Feito</Text>
            <View style={styles.inputWrapperMultiline}>
              <TextInput
                style={styles.multiline}
                value={whyToDo}
                onChangeText={setWhyToDo}
                placeholder="Justificativa"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Card 3 - Avaliação de Risco */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics-outline" size={22} color="#0F4C81" />
            <Text style={styles.sectionTitle}>Avaliação de Risco</Text>
          </View>

          <View style={styles.row}> 
            <View style={styles.half}> 
              <Dropdown label="Gravidade" options={GRAVITY_OPTIONS} selected={gravity} onSelect={setGravity} />
            </View>
            <View style={styles.half}> 
              <Dropdown label="Frequência" options={FREQUENCY_OPTIONS} selected={frequency} onSelect={setFrequency} />
            </View>
          </View>

          <View style={styles.row}> 
            <View style={styles.half}> 
              <Dropdown label="Probabilidade" options={PROBABILITY_OPTIONS} selected={probability} onSelect={setProbability} />
            </View>
            <View style={styles.half}> 
              <Dropdown label="Exposição" options={EXPOSURE_OPTIONS} selected={exposure} onSelect={setExposure} />
            </View>
          </View>

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
        </View>

        {/* Card 4 - Fotos */}
        <View style={[styles.card, { marginTop: 16 }]}> 
          <View style={styles.cardHeader}>
            <Ionicons name="camera-outline" size={22} color="#0F4C81" />
            <Text style={styles.sectionTitle}>Evidências Fotográficas</Text>
          </View>

          <PhotoPicker photos={photos} onPhotosChange={setPhotos} showLabel={false} />
        </View>

      </ScrollView>

      <View style={styles.footer}> 
        <TouchableOpacity
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <Text style={[styles.submitButtonText, !isValid && styles.disabledText]}>Salvar Ocorrência</Text>
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
    paddingBottom: 120,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  field: {
    marginBottom: 16,
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
  inputWrapperMultiline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  multiline: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    paddingBottom: 8,
    flex: 1,
  },
  result: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { fontSize: 16, fontWeight: '600' },
  resultScore: { fontSize: 18, fontWeight: '700', color: '#0F4C81' },
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
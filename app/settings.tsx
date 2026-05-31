import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, StyleSheet, ScrollView, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { settingsService } from '../services/settings';

export default function Settings() {
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    settingsService.load().then(s => {
      setCompanyName(s.companyName);
      setCompanyLogo(s.companyLogo);
    }).catch(console.error);
  }, []);

  const handleSelectLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      const mimeType = result.assets[0].mimeType ?? 'image/png';

  setCompanyLogo(
    `data:${mimeType};base64,${result.assets[0].base64}`
  );
}}

  const handleSave = async () => {
    try {
      await settingsService.save({ companyName, companyLogo });
      Alert.alert('Sucesso', 'Configurações salvas.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar configurações.');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome da Empresa</Text>
      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Ex: Cocari"
      />

      <Text style={styles.label}>Logo da Empresa</Text>

      <View style={styles.logoContainer}>
        {companyLogo ? (
          <Image source={{ uri: companyLogo }} style={styles.preview} resizeMode="contain" />
        ) : (
          <View style={styles.preview} />
        )}
      </View>

      <TouchableOpacity style={styles.selectButton} onPress={handleSelectLogo}>
        <Text style={styles.selectButtonText}>Selecionar Logo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 8, padding: 12, fontSize: 16,
  },
  selectButton: {
    backgroundColor: '#8b5cf6', padding: 12, borderRadius: 8,
    alignItems: 'center', marginTop: 8,
  },
  selectButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  logoContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  preview: {
    width: '100%',
    height: 125,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#3b82f6', padding: 16, borderRadius: 8,
    alignItems: 'center', marginTop: 32, marginBottom: 32,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
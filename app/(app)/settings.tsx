import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppModal } from '../../components/AppModal';
import { settingsService } from '../../services/settings';

export default function Settings() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [appModalVisible, setAppModalVisible] = useState(false);
  const [appModalConfig, setAppModalConfig] = useState<any>(null);

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
    }
  };

  const handleSave = async () => {
    try {
      await settingsService.save({ companyName, companyLogo });

      setAppModalConfig({
        title: 'Configurações salvas',
        message: 'As alterações foram salvas com sucesso.',
        type: 'success',
        confirmText: 'OK',
      });
      setAppModalVisible(true);
    } catch (error) {
      setAppModalConfig({
        title: 'Erro',
        message: 'Falha ao salvar configurações.',
        type: 'danger',
        confirmText: 'OK',
      });
      setAppModalVisible(true);
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F4C81', '#1A6BA8', '#4CAF50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.back()}
  >
    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>
    Configurações
  </Text>
</View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Empresa */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="business" size={24} color="#0F4C81" />
            <Text style={styles.sectionTitle}>Empresa</Text>
          </View>
          
          <Text style={styles.label}>Nome da Empresa</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Ex: Cocari"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Card Logo */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="image" size={24} color="#0F4C81" />
            <Text style={styles.sectionTitle}>Logo da Empresa</Text>
          </View>

          <View style={styles.logoPreviewContainer}>
            {companyLogo ? (
              <Image 
                source={{ uri: companyLogo }} 
                style={styles.logoPreview} 
                resizeMode="contain" 
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="image-outline" size={56} color="#D1D5DB" />
                <Text style={styles.placeholderText}>Sem logo</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.selectButton} 
            onPress={handleSelectLogo}
            activeOpacity={0.8}
          >
            <Ionicons name="image" size={20} color="#FFFFFF" />
            <Text style={styles.selectButtonText}>Selecionar Logo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.9}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <AppModal
        visible={appModalVisible}
        title={appModalConfig?.title || ''}
        message={appModalConfig?.message || ''}
        type={appModalConfig?.type || 'info'}
        confirmText={appModalConfig?.confirmText || 'OK'}
        onConfirm={() => {
          setAppModalVisible(false);
          if (appModalConfig?.type === 'success') {
            router.back();
          }
        }}
        isConfirmOnly={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  backButton: {
  padding: 8,
  borderRadius: 8,
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  logoPreviewContainer: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#0F4C81',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
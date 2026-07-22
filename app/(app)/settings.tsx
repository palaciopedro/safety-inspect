import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profile';

export default function Settings() {
  const { profile, refreshProfile, signOut } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name);
    setLastName(profile.last_name);
    setCompanyName(profile.company_name);
    loadLogoUrl(profile.company_logo_path);
  }, [profile]);

  const loadLogoUrl = async (path: string | null) => {
    if (!path) return;
    try {
      const url = await profileService.getLogoUrl(path);
      setLogoUrl(url);
    } catch {
      setLogoUrl(null);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Campos obrigatórios', 'Nome e sobrenome são obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      await profileService.update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        company_name: companyName.trim(),
      });
      await refreshProfile();
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectLogo = async () => {
    const asset = await profileService.pickLogo();
    if (!asset) return;

    setUploadingLogo(true);
    try {
      const path = await profileService.uploadLogo(asset);
      await profileService.update({ company_logo_path: path });
      await refreshProfile();
      const url = await profileService.getLogoUrl(path);
      setLogoUrl(url);
    } catch (error: any) {
      Alert.alert('Erro', error?.message ?? 'Não foi possível fazer upload da logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert('Erro', error?.message ?? 'Não foi possível sair.');
          }
        },
      },
    ]);
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Text style={styles.sectionTitle}>Meu Perfil</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Seu nome"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Seu sobrenome"
          autoCapitalize="words"
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Empresa</Text>

        <Text style={styles.label}>Nome da Empresa</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="Nome da empresa"
        />

        <Text style={styles.label}>Logo da Empresa</Text>

        <View style={styles.logoContainer}>
          {uploadingLogo ? (
            <ActivityIndicator color="#0F4C81" />
          ) : logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={styles.logoPreview}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.logoPlaceholder}>Nenhuma logo selecionada</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.secondaryButton, uploadingLogo && styles.disabled]}
          onPress={handleSelectLogo}
          disabled={uploadingLogo}
        >
          <Text style={styles.secondaryButtonText}>Selecionar Logo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.disabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scroll: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F4C81',
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 24,
  },
  logoContainer: {
    width: '100%',
    height: 125,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    overflow: 'hidden',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  logoPlaceholder: {
    fontSize: 13,
    color: '#999',
  },
  secondaryButton: {
    backgroundColor: '#8b5cf6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#0F4C81',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
  logoutButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
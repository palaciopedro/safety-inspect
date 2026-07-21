import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

type Mode = 'signIn' | 'signUp';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const switchMode = (next: Mode) => {
    reset();
    setMode(next);
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha e-mail e senha.');
      return;
    }

    if (mode === 'signUp') {
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Campos obrigatórios', 'Por favor, preencha nome e sobrenome.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signIn') {
        await signIn(trimmedEmail, trimmedPassword);
      } else {
        await signUp(trimmedEmail, trimmedPassword, firstName.trim(), lastName.trim());
      }
      // Navigation handled by RootGuard in _layout.tsx
    } catch (error: any) {
      const message = error?.message ?? 'Ocorreu um erro. Tente novamente.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = mode === 'signUp';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.appName}>Safety Inspect</Text>
          <Text style={styles.tagline}>Gestão de Inspeções SST</Text>

          {/* Tab toggle */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, !isSignUp && styles.tabActive]}
              onPress={() => switchMode('signIn')}
            >
              <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
                Entrar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isSignUp && styles.tabActive]}
              onPress={() => switchMode('signUp')}
            >
              <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
                Cadastrar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up extra fields */}
          {isSignUp && (
            <>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Seu nome"
                autoCapitalize="words"
                returnKeyType="next"
              />
              <Text style={styles.label}>Sobrenome</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Seu sobrenome"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </>
          )}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Criar conta' : 'Entrar'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F4C81',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F4C81',
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#0F4C81',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#0F4C81',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Inspection } from '../../types';
import { InspectionCard } from '../../components/InspectionCard';
import { db } from '../../services/database';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

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
  <SafeAreaView style={styles.container}>
    <LinearGradient
      colors={['#0F4C81', '#1A6BA8', '#4FAE6B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <View style={styles.brand}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text style={styles.title}>Safety Inspect</Text>
          <Text style={styles.subtitle}>
            Gestão de Inspeções SST
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push('/settings')}
      >
        <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>

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

    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push('/new-inspection')}
    >
      <Ionicons name="add" size={34} color="#fff" />
    </TouchableOpacity>

    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        padding: 15,
        margin: 20,
      }}
      onPress={async () => {
        await signOut();
      }}
    >
      <Text style={{ color: '#fff' }}>
        SAIR
      </Text>
    </TouchableOpacity>

  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 56,
    height: 56,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },

  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    gap: 12,
  },

fab: {
  position: 'absolute',
  right: 20,
  bottom: 20,

  width: 68,
  height: 68,
  borderRadius: 34,

  backgroundColor: '#4CAF50',

  justifyContent: 'center',
  alignItems: 'center',

  elevation: 8,
},

  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  }
});
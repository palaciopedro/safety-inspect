import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { processImage } from '../utils/image';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  showLabel?: boolean;
}

export const PhotoPicker = ({ photos, onPhotosChange, showLabel = true }: Props) => {
  const [loading, setLoading] = useState(false);

  const pickImages = async (source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permissão de câmera é necessária');
        return;
      }
    }

    setLoading(true);
    try {
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({ quality: 1 })
        : await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            quality: 1,
          });

      if (!result.canceled && result.assets.length > 0) {
        const processed = await Promise.all(
          result.assets.map(a => processImage(a.uri, (a as any).mimeType))
        );
        onPhotosChange([...photos, ...processed]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar imagem');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (index: number) => {
    Alert.alert(
      'Remover Foto',
      'Deseja remover esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => onPhotosChange(photos.filter((_, i) => i !== index)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Ionicons name="camera-outline" size={18} color="#0F4C81" style={{ marginRight: 8 }} />
          <Text style={styles.label}>Evidências Fotográficas</Text>
        </View>
      )}

      {photos.length > 0 && (
        <FlatList
          data={photos}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.list}
          renderItem={({ item, index }) => (
            <View style={styles.photoWrapper}>
              <Image source={{ uri: item }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <Text style={styles.removeText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton, loading && styles.disabled]}
          onPress={() => pickImages('camera')}
          disabled={loading}
        >
          <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonLabel}>Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton, loading && styles.disabled]}
          onPress={() => pickImages('gallery')}
          disabled={loading}
        >
          <Ionicons name="images-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonLabel}>Galeria</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loader} color="#0F4C81" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  list: {
    marginBottom: 12,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(239,68,68,0.9)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cameraButton: {
    backgroundColor: '#0F4C81',
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginTop: 8,
  },
});
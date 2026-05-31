import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { processImage } from '../utils/image';

interface Props {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export const PhotoPicker = ({ photos, onPhotosChange }: Props) => {
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
      <Text style={styles.label}>Fotos do Local</Text>

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
          <Text style={styles.buttonText}>Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton, loading && styles.disabled]}
          onPress={() => pickImages('gallery')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Galeria</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loader} color="#3b82f6" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
    borderRadius: 8,
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
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#3b82f6',
  },
  galleryButton: {
    backgroundColor: '#8b5cf6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    marginTop: 8,
  },
});
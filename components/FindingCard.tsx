import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import { Finding } from '../types';
import { RiskBadge } from './RiskBadge';
import { Svg, Path, Rect } from 'react-native-svg';

interface Props {
  finding: Finding;
  onDelete: () => void;
}

const TrashIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="#ef4444">
    <Path d="M3 6h18v2H3V6zm2 3h14l-1 13H6L5 9zm5-6h4v1H10V3z"/>
    <Rect x="8" y="10" width="2" height="8"/>
    <Rect x="11" y="10" width="2" height="8"/>
    <Rect x="14" y="10" width="2" height="8"/>
  </Svg>
);

export const FindingCard = ({ finding, onDelete }: Props) => {
  const handleDelete = () => {
    Alert.alert(
      'Excluir Ocorrência',
      'Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.description}>{finding.risk_description}</Text>
        <RiskBadge level={finding.risk_level} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Setor:</Text>
        <Text style={styles.value}>{finding.sector}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Pontuação:</Text>
        <Text style={styles.value}>{finding.calculated_score.toFixed(2)}</Text>
      </View>

      {finding.photos?.length > 0 && (
        <FlatList
          data={finding.photos}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoList}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.photo} />
          )}
        />
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <TrashIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e5e7eb',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  description: { fontSize: 14, fontWeight: '500', flex: 1 },
  row: { flexDirection: 'row', gap: 8 },
  label: { fontSize: 12, color: '#666', fontWeight: '600' },
  value: { fontSize: 12, color: '#666' },
  photoList: { marginTop: 4 },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 6,
    backgroundColor: '#f3f4f6',
  },
  deleteButton: { position: 'absolute', bottom: 8, right: 8, padding: 4 },
});
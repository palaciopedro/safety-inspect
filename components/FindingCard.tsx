import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import { Finding } from '../types';
import { RiskBadge } from './RiskBadge';
import { Svg, Path, Rect } from 'react-native-svg';

interface Props {
  finding: Finding;
  onDelete: () => void;
  onEdit: () => void;
}

const TrashIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="#ef4444">
    <Path d="M3 6h18v2H3V6zm2 3h14l-1 13H6L5 9zm5-6h4v1H10V3z"/>
    <Rect x="8" y="10" width="2" height="8"/>
    <Rect x="11" y="10" width="2" height="8"/>
    <Rect x="14" y="10" width="2" height="8"/>
  </Svg>
);

const PencilIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="#eab308">
    <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </Svg>
);

export const FindingCard = ({ finding, onDelete, onEdit }: Props) => {
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

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
          <PencilIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
          <TrashIcon />
        </TouchableOpacity>
      </View>
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
    width: 80, height: 80, borderRadius: 6,
    marginRight: 6, backgroundColor: '#f3f4f6',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  iconButton: { padding: 4 },
});
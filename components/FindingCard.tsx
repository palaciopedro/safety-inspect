import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Finding } from '../types';
import { RiskBadge } from './RiskBadge';
import { AppModal } from './AppModal';

interface Props {
  finding: Finding;
  onDelete: () => void;
  onEdit: () => void;
}

export const FindingCard = ({ finding, onDelete, onEdit }: Props) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.description}>{finding.risk_description}</Text>
        <RiskBadge level={finding.risk_level} />
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="business-outline" size={18} color="#0F4C81" style={styles.infoIcon} />
        <Text style={styles.label}>Setor:</Text>
        <Text style={styles.value}>{finding.sector}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="document-text-outline" size={18} color="#0F4C81" style={styles.infoIcon} />
        <Text style={styles.label}>Requisito Legal:</Text>
        <Text style={styles.value}>{finding.legal_requirement}</Text>
      </View>

      <View style={styles.infoRow}> 
        <Ionicons name="analytics-outline" size={18} color="#0F4C81" style={styles.infoIcon} />
        <Text style={styles.label}>HRN:</Text>
        <Text style={styles.value}>{finding.calculated_score.toFixed(2)}</Text>
      </View>

      {finding.photos?.length > 0 && (
        <>
          <View style={styles.infoRow}>
            <Ionicons name="camera-outline" size={18} color="#0F4C81" style={styles.infoIcon} />
            <Text style={styles.label}>{finding.photos.length} fotos anexadas</Text>
          </View>
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
        </>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color="#0F4C81" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <AppModal
        visible={deleteModalVisible}
        title="Excluir Ocorrência"
        message="Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
        type="danger"
        confirmText="Excluir"
        cancelText="Cancelar"
        showCancelButton={true}
        onConfirm={() => {
          setDeleteModalVisible(false);
          onDelete();
        }}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  infoIcon: {
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
  },
  value: {
    fontSize: 13,
    color: '#374151',
    flexShrink: 1,
  },
  photoList: {
    marginTop: 4,
  },
  photo: {
    width: 124,
    height: 124,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
});
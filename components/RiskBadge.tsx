import { View, Text, StyleSheet } from 'react-native';
import { RiskLevel } from '@/types';
import { getRiskColor } from '@/utils/risk';

interface Props {
  level: RiskLevel;
}

export const RiskBadge = ({ level }: Props) => (
  <View style={[styles.badge, { backgroundColor: getRiskColor(level) }]}>
    <Text style={styles.text}>{level.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

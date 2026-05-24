import { View, Text, StyleSheet } from 'react-native';
import { Finding } from '@/types';
import { RiskBadge } from './RiskBadge';

interface Props {
  finding: Finding;
}

export const FindingCard = ({ finding }: Props) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.description}>{finding.description}</Text>
      <RiskBadge level={finding.risk_level} />
    </View>
    <View style={styles.metrics}>
      <Text style={styles.metric}>Prob: {finding.probability}</Text>
      <Text style={styles.metric}>Imp: {finding.impact}</Text>
    </View>
  </View>
);

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
  description: {
    fontSize: 14,
    flex: 1,
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    fontSize: 12,
    color: '#666',
  },
});

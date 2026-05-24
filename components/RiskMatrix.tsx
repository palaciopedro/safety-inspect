import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Probability, Impact } from '../types';
import { calculateRisk, getRiskColor } from '../utils/risk';

interface Props {
  onSelect: (probability: Probability, impact: Impact) => void;
  selected?: { probability: Probability; impact: Impact };
}

export const RiskMatrix = ({ onSelect, selected }: Props) => {
  const probabilities: Probability[] = [5, 4, 3, 2, 1];
  const impacts: Impact[] = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.matrix}>
        <View style={styles.yAxis}>
          <Text style={styles.label}>PROBABILIDADE</Text>
          {probabilities.map(p => (
            <Text key={p} style={styles.axisValue}>{p}</Text>
          ))}
        </View>
        
        <View style={styles.grid}>
          {probabilities.map(prob => (
            <View key={prob} style={styles.row}>
              {impacts.map(imp => {
                const risk = calculateRisk(prob, imp);
                const isSelected = selected?.probability === prob && selected?.impact === imp;
                return (
                  <TouchableOpacity
                    key={`${prob}-${imp}`}
                    style={[
                      styles.cell,
                      { backgroundColor: getRiskColor(risk) },
                      isSelected && styles.selected
                    ]}
                    onPress={() => onSelect(prob, imp)}
                  />
                );
              })}
            </View>
          ))}
          <View style={styles.xAxis}>
            {impacts.map(i => (
              <Text key={i} style={styles.axisValue}>{i}</Text>
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.label}>IMPACTO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  matrix: {
    flexDirection: 'row',
    gap: 8,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  grid: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  cell: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#000',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  axisValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
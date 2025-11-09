import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export const CommentsInput: React.FC<Props> = ({ value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Special Instructions</Text>
      <Text style={styles.subtitle}>Add any special requests or modifications</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="e.g., extra sauce, well done, cut in squares..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        maxLength={200}
      />
      <Text style={styles.charCount}>{value.length}/200</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
});

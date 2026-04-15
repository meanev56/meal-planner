/**
 * Copy Menu Modal
 * @format
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function CopyModal() {
  const router = useRouter();
  const isDarkMode = useColorScheme() === 'dark';

  const { prevDate, nextDate } = useLocalSearchParams<{
    prevDate: string;
    nextDate: string;
  }>();

  const handleCopy = async () => {
    if (!prevDate || !nextDate) {
      Alert.alert('Error', 'Missing date information');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/copyItems', {
        prevDate,
        nextDate,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Menu items copied successfully!');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to copy items');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while copying');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
          Copy Menu
        </Text>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>From</Text>
          <Text style={[styles.dateText, { color: isDarkMode ? '#fff' : '#000' }]}>
            {prevDate}
          </Text>

          <Text style={styles.arrow}>↓</Text>

          <Text style={styles.dateLabel}>To</Text>
          <Text style={[styles.dateText, { color: isDarkMode ? '#fff' : '#000' }]}>
            {nextDate}
          </Text>
        </View>

        <Text style={[styles.description, { color: isDarkMode ? '#ccc' : '#666' }]}>
          This will copy all meals from {prevDate} to {nextDate}.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Text style={styles.copyButtonText}>Copy Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 22,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 28,
    marginVertical: 8,
    color: '#FF6B6B',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  copyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
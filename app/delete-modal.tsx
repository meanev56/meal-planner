/**
 * Delete Menu Modal
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

export default function DeleteModal() {
  const router = useRouter();
  const isDarkMode = useColorScheme() === 'dark';

  const { date } = useLocalSearchParams<{ date: string }>();

  const handleDelete = async () => {
    if (!date) {
      Alert.alert('Error', 'Date information missing');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/deleteItems/${date}`);

      if (response.status === 200) {
        Alert.alert('Success', `Menu for ${date} has been deleted`);
        router.back();
      } else {
        Alert.alert('Error', 'Failed to delete menu');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }]}>
      <View style={styles.content}>
        <Text style={[styles.warningIcon, { color: '#FF3B30' }]}>⚠️</Text>

        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
          Delete Menu
        </Text>

        <Text style={[styles.subtitle, { color: isDarkMode ? '#ccc' : '#666' }]}>
          Are you sure you want to delete the entire menu for
        </Text>

        <Text style={[styles.date, { color: isDarkMode ? '#fff' : '#000' }]}>
          {date}
        </Text>

        <Text style={[styles.warningText, { color: '#FF3B30' }]}>
          This action cannot be undone.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Yes, Delete</Text>
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
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  warningText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 40,
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
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
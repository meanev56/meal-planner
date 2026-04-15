/**
 * Meal Planner - Menu Screen
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

interface MenuItem {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  type: 'Staple' | 'Main' | 'Side' | 'Soup';
  name: string;
}

export default function MenuScreen() {
  const router = useRouter();
  const isDarkMode = useColorScheme() === 'dark';

  const { date, items } = useLocalSearchParams<{ date: string; items?: string }>();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishName, setDishName] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Breakfast');
  const [dishCategory, setDishCategory] = useState<'Staple' | 'Main' | 'Side' | 'Soup'>('Main');

  // Load passed items
  useEffect(() => {
    if (items) {
      try {
        const parsed = JSON.parse(items);
        setMenuItems(parsed);
      } catch (e) {
        console.error('Failed to parse menu items');
      }
    }
  }, [items]);

  const addDishToMenu = async () => {
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }

    const newDish: MenuItem = {
      date: date || '',
      name: dishName.trim(),
      type: dishCategory,
      mealType: mealType,
    };

    try {
      await axios.post('http://localhost:3000/menu/addDish', newDish);

      setMenuItems((prev) => [...prev, newDish]);
      setDishName('');
      Alert.alert('Success', 'Dish added successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add dish. Please try again.');
    }
  };

  const deleteDish = (index: number) => {
    Alert.alert('Delete Dish', 'Are you sure you want to remove this dish?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMenuItems((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  // Group items by meal type
  const groupedItems = {
    Breakfast: menuItems.filter((item) => item.mealType === 'Breakfast'),
    Lunch: menuItems.filter((item) => item.mealType === 'Lunch'),
    Dinner: menuItems.filter((item) => item.mealType === 'Dinner'),
  };

  const renderMealSection = (type: 'Breakfast' | 'Lunch' | 'Dinner', title: string) => {
    const sectionItems = groupedItems[type];
    if (sectionItems.length === 0) return null;

    return (
      <View key={type} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        {sectionItems.map((item, index) => (
          <View key={index} style={styles.dishCard}>
            <View style={styles.dishInfo}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.type}</Text>
              </View>
              <Text style={styles.dishName}>{item.name}</Text>
            </View>

            <TouchableOpacity
              onPress={() => deleteDish(menuItems.indexOf(item))}
              style={styles.deleteButton}>
              <Text style={styles.deleteIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerDate}>{date}</Text>

        <TouchableOpacity
          onPress={() => Alert.alert('Delete Menu', 'This will delete the entire menu for this day.', [
            { text: 'Cancel' },
            { text: 'Delete', style: 'destructive' },
          ])}>
          <Text style={styles.deleteHeader}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Meal Type Tabs */}
        <View style={styles.mealSelector}>
          {(['Breakfast', 'Lunch', 'Dinner'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setMealType(type)}
              style={[
                styles.mealOption,
                mealType === type && styles.mealOptionActive,
              ]}>
              <Text
                style={[
                  styles.mealOptionText,
                  mealType === type && styles.mealOptionTextActive,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.length > 0 ? (
            <>
              {renderMealSection('Breakfast', 'Breakfast')}
              {renderMealSection('Lunch', 'Lunch')}
              {renderMealSection('Dinner', 'Dinner')}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>No dishes yet</Text>
              <Text style={styles.emptySubtitle}>
                Add dishes using the form below
              </Text>
            </View>
          )}
        </View>

        {/* Add New Dish Section */}
        <View style={[styles.addSection, { backgroundColor: isDarkMode ? '#1f1f1f' : '#fff' }]}>
          <Text style={[styles.addTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
            Add New Dish
          </Text>

          {/* Dish Category Chips */}
          <View style={styles.categorySelector}>
            {(['Staple', 'Main', 'Side', 'Soup'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setDishCategory(cat)}
                style={[
                  styles.categoryChip,
                  dishCategory === cat && styles.categoryChipActive,
                ]}>
                <Text
                  style={[
                    styles.categoryChipText,
                    dishCategory === cat && styles.categoryChipTextActive,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dish Input + Add Button */}
          <View style={styles.inputContainer}>
            <TextInput
              value={dishName}
              onChangeText={setDishName}
              style={[styles.input, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f9f9f9' }]}
              placeholder="Enter dish name (e.g. Fried Rice)"
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
            />

            <TouchableOpacity onPress={addDishToMenu} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FF6B6B',
    paddingTop: 50,
  },
  backButton: { paddingVertical: 8, paddingRight: 12 },
  backText: { color: 'white', fontSize: 17, fontWeight: '500' },
  headerDate: { flex: 1, color: 'white', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  deleteHeader: { color: 'white', fontSize: 17, fontWeight: '500' },

  container: { flex: 1 },
  scrollContent: { padding: 16 },

  mealSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 6,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  mealOption: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 25,
  },
  mealOptionActive: {
    backgroundColor: '#FF6B6B',
  },
  mealOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  mealOptionTextActive: {
    color: 'white',
  },

  menuContainer: { marginBottom: 32 },
  section: { marginBottom: 24 },
  sectionHeader: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },

  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  dishInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: { color: 'white', fontSize: 12, fontWeight: '700' },
  dishName: { fontSize: 17, fontWeight: '500', flex: 1 },

  deleteButton: {
    padding: 10,
  },
  deleteIcon: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: 'bold',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#666', marginBottom: 8 },
  emptySubtitle: { color: '#999', textAlign: 'center' },

  addSection: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  addTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  categoryChipText: { fontWeight: '600', fontSize: 14 },
  categoryChipTextActive: { color: 'white' },

  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    justifyContent: 'center',
    borderRadius: 14,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 17,
  },
});
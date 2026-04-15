/**
 * Meal Planner - Home Screen
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import dayjs from 'dayjs';
import axios from 'axios';

interface MenuItem {
  mealType: string;
  type: string;
  name: string;
}

interface MenuData {
  date: string;
  items: MenuItem[];
}

export default function Index() {
  const router = useRouter();
  const isDarkMode = useColorScheme() === 'dark';

  const today = dayjs();
  const startOfWeek = today.startOf('week');

  const [menuData, setMenuData] = useState<MenuData[]>([]);

  const fetchAllMenuData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/menu/all');
      setMenuData(response.data || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllMenuData();
    }, [])
  );

  useEffect(() => {
    fetchAllMenuData();
  }, []);

  const openCopyModal = (date: dayjs.Dayjs) => {
    const formatted = date.format('ddd DD');
    const nextDay = date.add(1, 'day').format('ddd DD');

    router.push({
      pathname: '/copy-modal',
      params: { prevDate: formatted, nextDate: nextDay },
    });
  };

  const openDeleteModal = (date: dayjs.Dayjs) => {
    const formatted = date.format('ddd DD');
    router.push({
      pathname: '/delete-modal',
      params: { date: formatted },
    });
  };

  const navigateToMenu = (dateStr: string, items?: MenuItem[]) => {
    router.push({
      pathname: '/menu',
      params: { date: dateStr, items: JSON.stringify(items || []) },
    });
  };

  // Add new meal for a specific date
  const addNewMeal = (date: dayjs.Dayjs) => {
    const formattedDate = date.format('ddd DD');
    router.push({
      pathname: '/menu',
      params: { date: formattedDate },
    });
  };

  // Render single day card
  const renderDay = (date: dayjs.Dayjs) => {
    const formattedDate = date.format('ddd DD');
    const menuForDate = menuData.find((m) => m.date === formattedDate);
    const isToday = date.isSame(today, 'day');

    return (
      <View key={formattedDate} style={styles.dayContainer}>
        {/* Date Circle */}
        <View style={[styles.dateCircle, isToday && styles.todayCircle]}>
          <Text style={[styles.dateText, isToday && styles.todayText]}>
            {date.format('DD')}
          </Text>
          <Text style={[styles.dayText, isToday && styles.todayText]}>
            {date.format('ddd')}
          </Text>
        </View>

        {/* Meal Card */}
        <TouchableOpacity
          style={[styles.mealCard, !menuForDate && styles.emptyMealCard]}
          onPress={() => navigateToMenu(formattedDate, menuForDate?.items)}
          activeOpacity={0.92}
        >
          {menuForDate && menuForDate.items.length > 0 ? (
            <View>
              <Text style={styles.mealPlanLabel}>Meal Plan</Text>

              {(['Breakfast', 'Lunch', 'Dinner'] as const).map((mealType) => {
                const items = menuForDate.items.filter((item) => item.mealType === mealType);
                if (items.length === 0) return null;

                return (
                  <View key={mealType} style={styles.mealSection}>
                    <View style={styles.mealTypeBadge}>
                      <Text style={styles.mealTypeText}>{mealType}</Text>
                    </View>
                    {items.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <View style={styles.itemTypeBadge}>
                          <Text style={styles.itemTypeText}>{item.type}</Text>
                        </View>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.noMenuText}>No menu planned</Text>
              <Text style={styles.emptySubText}>Tap to add meals</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => openCopyModal(date)}
              style={styles.actionBtn}>
              <Text style={styles.actionText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openDeleteModal(date)}
              style={styles.actionBtn}>
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Floating Add Button on each card */}
        <TouchableOpacity
          style={styles.addButtonSmall}
          onPress={() => addNewMeal(date)}
        >
          <Text style={styles.addButtonSmallText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeeks = (numWeeks: number) => {
    return Array.from({ length: numWeeks }).map((_, i) => {
      const weekStart = startOfWeek.add(i * 7, 'day');
      return (
        <View key={i} style={styles.weekContainer}>
          <Text style={styles.weekTitle}>
            {weekStart.format('DD MMM')} — {weekStart.add(6, 'day').format('DD MMM')}
          </Text>
          {Array.from({ length: 7 }).map((_, idx) =>
            renderDay(weekStart.add(idx, 'day'))
          )}
        </View>
      );
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#f8f9fa' }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.screenTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
          This Week's Meals
        </Text>

        {renderWeeks(3)}
      </ScrollView>

      {/* Global Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          const todayFormatted = today.format('ddd DD');
          router.push({
            pathname: '/menu',
            params: { date: todayFormatted },
          });
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingTop: 20, paddingBottom: 100 },

  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },

  weekContainer: { marginBottom: 32 },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    color: '#666',
  },

  dayContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    position: 'relative',
  },

  dateCircle: {
    height: 58,
    width: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#eee',
  },
  todayCircle: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  dateText: { fontSize: 19, fontWeight: '700' },
  dayText: { fontSize: 11.5, fontWeight: '600' },
  todayText: { color: '#fff' },

  mealCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyMealCard: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 130,
  },

  mealPlanLabel: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
    color: '#FF6B6B',
  },

  emptyState: {
    alignItems: 'center',
  },
  noMenuText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubText: {
    color: '#bbb',
    fontSize: 13,
    marginTop: 4,
  },

  mealSection: { marginBottom: 14 },
  mealTypeBadge: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  mealTypeText: { fontWeight: '700', fontSize: 13.5, color: '#444' },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 5,
  },
  itemTypeBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
  },
  itemTypeText: { color: '#fff', fontSize: 11.5, fontWeight: '700' },
  itemName: { fontWeight: '500', flex: 1, fontSize: 15.5 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 18,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionBtn: {},
  actionText: {
    fontSize: 13.5,
    color: '#FF6B6B',
    fontWeight: '600',
  },

  // Small Add Button on each card
  addButtonSmall: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonSmallText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },

  // Global Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FF6B6B',
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 34,
  },
});
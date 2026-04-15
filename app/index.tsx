/**
 * Meal Planner - Home Screen
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? '#ffffff' : '#000000',
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? '#aaaaaa' : '#666666',
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

export default function Index() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
  };

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
            paddingTop: 60,
          }}>
          
          <Text style={[styles.highlight, { fontSize: 32, marginBottom: 12 }]}>
            🍽️ Meal Planner
          </Text>
          
          <Text style={{ textAlign: 'center', marginBottom: 40, fontSize: 18 }}>
            Edit <Text style={styles.highlight}>app/index.tsx</Text> to customize this screen.
          </Text>

          <Section title="Getting Started">
            This is your home screen. Start building your meal planner here.
          </Section>

          <Section title="Next Steps">
            Add navigation, meal cards, recipe lists, and more using Expo Router.
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
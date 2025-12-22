import React from 'react';
import { StyleSheet, View } from 'react-native';
import SwipeableCard from '@/components/SwipeableCard';

const Settings = () => {
  return (
    <View style={styles.container}>
      <SwipeableCard />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

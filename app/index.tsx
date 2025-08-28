import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Page</Text>
      <Text style={styles.link}>Visit our website</Text>
      <Pressable onPress={() => console.log('Toggle pressed')}>
        <Text style={styles.toggle}>Toggle Something</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 20,
  },
  toggle: {
    fontSize: 16,
    color: '#555',
  },
});

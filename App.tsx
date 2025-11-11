import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import RoomView from './src/components/RoomView';

export default function App() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  const handleObjectTap = (objectId: string) => {
    setSelectedObject(objectId);

    // Show which object was tapped
    const objectNames: Record<string, string> = {
      desk: 'Desk',
      filing_cabinet: 'Filing Cabinet',
      poster: 'Motivational Poster',
      exit_door: 'Exit Door',
      vent: 'Ventilation Grate',
    };

    Alert.alert(
      'Object Tapped',
      `You tapped: ${objectNames[objectId] || objectId}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Training Basement - Escape Room</Text>
        <Text style={styles.subHeaderText}>
          Use two fingers to pan and pinch to zoom
        </Text>
        {selectedObject && (
          <Text style={styles.selectedText}>
            Selected: {selectedObject}
          </Text>
        )}
      </View>

      <RoomView onObjectTap={handleObjectTap} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  selectedText: {
    color: '#4A90E2',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

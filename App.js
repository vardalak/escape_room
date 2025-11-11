import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import RoomView from './src/components/RoomView';
import ExaminationModal from './src/components/ExaminationModal';

// Object data for Training Basement
const OBJECT_DATA = {
  poster: {
    name: 'Motivational Poster',
    description: 'A framed poster hangs on the wall with a bold blue banner reading "START HERE" and an arrow pointing downward. Below it reads: "Every escape begins with a single clue..."\n\nYou notice some faint decorative circles on the poster. Looking closer, there seem to be very subtle numbers or markings inside them, though they\'re hard to make out.',
    actions: [
      { id: 'examine_closer', label: 'Look at the decorative circles more closely' },
      { id: 'back', label: 'Step back' },
    ],
  },
  vent: {
    name: 'Ventilation Grate',
    description: 'A metal ventilation grate with horizontal slats. Through the gaps between the slats, you can see something white - it looks like a piece of paper wedged inside.\n\nYou can make out some text on it: "42--" but the rest is obscured.',
    actions: [
      { id: 'try_remove', label: 'Try to remove the grate screws', disabled: true },
      { id: 'peer_closer', label: 'Peer through the slats' },
    ],
  },
  filing_cabinet: {
    name: 'Filing Cabinet',
    description: 'A grey metal filing cabinet with two drawers labeled "A-M" and "N-Z". The top drawer appears to be locked, but the bottom drawer has a green unlocked indicator showing it\'s open.\n\nThe bottom drawer is slightly ajar.',
    actions: [
      { id: 'open_bottom', label: 'Open bottom drawer (N-Z)' },
      { id: 'try_top', label: 'Try to open top drawer (A-M)', disabled: true },
    ],
  },
  desk: {
    name: 'Desk',
    description: 'A wooden desk with three drawers on the left side. The top two drawers are unlocked, but the bottom drawer has a small padlock securing it.\n\nThe lock looks like it needs a physical key.',
    actions: [
      { id: 'open_drawer1', label: 'Open top drawer' },
      { id: 'open_drawer2', label: 'Open middle drawer' },
      { id: 'try_bottom', label: 'Try bottom drawer (locked)', disabled: true },
      { id: 'examine_lock', label: 'Examine the padlock' },
    ],
  },
  exit_door: {
    name: 'Exit Door',
    description: 'A sturdy wooden door with an "EXIT" sign above it. On the right side of the door is a black keypad with a digital display and numbered buttons (0-9, *, #).\n\nThe display shows a red locked indicator light. The keypad appears to be waiting for a 4-digit code.',
    actions: [
      { id: 'try_handle', label: 'Try the door handle', disabled: true },
      { id: 'enter_code', label: 'Enter code on keypad' },
      { id: 'examine_keypad', label: 'Examine the keypad closely' },
    ],
  },
};

export default function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleObjectTap = (objectId) => {
    setSelectedObject(objectId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleAction = (actionId) => {
    console.log(`Action triggered: ${actionId} on ${selectedObject}`);
    // TODO: Implement actual game logic here
    // For now, just log the action
  };

  // Get current object data
  const currentObject = selectedObject ? OBJECT_DATA[selectedObject] : null;
  const actions = currentObject
    ? currentObject.actions.map((action) => ({
        ...action,
        onPress: () => handleAction(action.id),
      }))
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Training Basement - Escape Room</Text>
        <Text style={styles.subHeaderText}>
          Tap objects to examine them
        </Text>
      </View>

      <RoomView onObjectTap={handleObjectTap} />

      <ExaminationModal
        visible={modalVisible}
        onClose={handleCloseModal}
        objectId={selectedObject}
        objectName={currentObject?.name || ''}
        description={currentObject?.description || ''}
        actions={actions}
      />
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

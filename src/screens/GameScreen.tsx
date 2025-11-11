import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import RoomView from '../components/RoomView';
import ExaminationModal from '../components/ExaminationModal';
import KeypadModal from '../components/KeypadModal';
import { useGameState } from '../hooks/useGameState';
import { playerProgressManager } from '../services/PlayerProgressManager';

interface GameScreenProps {
  experienceId: string;
  onExit: () => void;
}

export default function GameScreen({ experienceId, onExit }: GameScreenProps) {
  const {
    experience,
    loading,
    inventory,
    gameWon,
    message,
    examineItem,
    openContainer,
    takeItem,
    useKey,
    enterCode,
  } = useGameState(experienceId);

  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [examinationModalVisible, setExaminationModalVisible] = useState(false);
  const [keypadModalVisible, setKeypadModalVisible] = useState(false);
  const [currentTriggerId, setCurrentTriggerId] = useState<string | null>(null);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading {experienceId}...</Text>
      </View>
    );
  }

  if (gameWon) {
    // Save progress when game is won
    if (experience) {
      const playTime = experience.getPlayTime();
      playerProgressManager.completeExperience(experienceId, playTime);
    }

    return (
      <View style={styles.victoryContainer}>
        <Text style={styles.victoryTitle}>🎉 CONGRATULATIONS! 🎉</Text>
        <Text style={styles.victoryText}>
          You've escaped the {experience?.name || 'room'}!
        </Text>
        <Text style={styles.victorySubtext}>
          {experience?.storyOutro || 'You\'re ready for the real challenges ahead.'}
        </Text>

        {/* Return to Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={onExit}>
          <Text style={styles.homeButtonText}>RETURN TO HOME</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleObjectTap = (objectId: string) => {
    setSelectedObject(objectId);
    setExaminationModalVisible(true);
  };

  const handleCloseExaminationModal = () => {
    setExaminationModalVisible(false);
  };

  const handleAction = (actionId: string) => {
    console.log(`Action: ${actionId} on ${selectedObject}`);

    // Handle different actions
    switch (actionId) {
      case 'examine_closer':
        if (selectedObject === 'poster') {
          alert('The poster reads: "Welcome, Trainee! Your goal: Escape through the exit door. Search the room for clues and keys. Examine objects carefully - some hide secrets. Combine what you find to unlock your way out. Good luck!"');
        }
        break;

      case 'peer_closer':
        if (selectedObject === 'vent') {
          alert('Peering through the slats, you can see a piece of paper wedged inside. Two numbers are clearly visible: "42". The rest is hidden behind the metal grate.');
        }
        break;

      case 'open_top':
        if (selectedObject === 'filing_cabinet') {
          const result = openContainer('filing_cabinet_top');
          if (result.success) {
            alert('You open the A-M drawer and find a brass key inside!');
            // Auto-take the key
            takeItem('brass_key', 'filing_cabinet_top');
          }
        }
        break;

      case 'open_drawer1':
      case 'open_drawer2':
        if (selectedObject === 'desk') {
          alert('The drawer is empty except for some old paperclips.');
        }
        break;

      case 'try_bottom':
        if (selectedObject === 'desk') {
          if (inventory.find(k => k.id === 'brass_key')) {
            const result = useKey('brass_key', 'desk_middle_drawer_lock');
            if (result.success) {
              alert('The brass key fits! The drawer unlocks. Inside you find a crumpled note with two numbers scrawled on it: "17"');
            } else {
              alert('Something went wrong: ' + result.message);
            }
          } else {
            alert('The drawer is locked. You need a key.');
          }
        }
        break;

      case 'examine_lock':
        alert('It\'s a standard padlock. Looks like it needs a small brass key.');
        break;

      case 'enter_code':
        setCurrentTriggerId('exit_door_keypad');
        setKeypadModalVisible(true);
        setExaminationModalVisible(false);
        break;

      case 'examine_keypad':
        alert('The keypad has buttons 0-9, *, and #. The display shows 4 empty slots, waiting for a 4-digit code.');
        break;

      default:
        alert(`Action "${actionId}" not yet implemented`);
    }
  };

  const handleCodeSubmit = (code: string) => {
    setKeypadModalVisible(false);

    if (currentTriggerId) {
      const result = enterCode(currentTriggerId, code);
      if (result.success) {
        alert('✅ ACCESS GRANTED! The door unlocks!');
        // Game will auto-detect completion and show victory screen
      } else {
        alert(`❌ ACCESS DENIED. Incorrect code: ${code}`);
      }
    }
  };

  // Get current object data
  const getObjectData = (objectId: string | null) => {
    if (!objectId) return null;

    const hasKey = inventory.find(k => k.id === 'brass_key');

    const objectData: { [key: string]: any } = {
      poster: {
        name: 'Motivational Poster',
        description: 'A framed poster with "START HERE" in bold letters and a red arrow pointing down. It appears to have instructions for new trainees.',
        actions: [
          { id: 'examine_closer', label: 'Read the poster' },
        ],
      },
      vent: {
        name: 'Ventilation Grate',
        description: 'A metal grate with horizontal slats. Through the gaps, you can barely make out a piece of paper wedged inside with some numbers visible.',
        actions: [
          { id: 'peer_closer', label: 'Peer through the slats' },
        ],
      },
      filing_cabinet: {
        name: 'Filing Cabinet',
        description: 'A grey metal filing cabinet. Top drawer (A-M) shows a green unlocked indicator. Bottom drawer (N-Z) is locked.',
        actions: [
          { id: 'open_top', label: 'Open top drawer (A-M)' },
          { id: 'try_bottom', label: 'Try bottom drawer (N-Z)', disabled: true },
        ],
      },
      desk: {
        name: 'Desk',
        description: 'A wooden desk with three drawers. Top two are unlocked and empty. Bottom drawer has a padlock.' + (hasKey ? ' You have a brass key that might fit.' : ''),
        actions: [
          { id: 'open_drawer1', label: 'Open top drawer' },
          { id: 'open_drawer2', label: 'Open middle drawer' },
          { id: 'try_bottom', label: hasKey ? 'Unlock bottom drawer with brass key' : 'Try bottom drawer (locked)', disabled: !hasKey },
          { id: 'examine_lock', label: 'Examine the padlock' },
        ],
      },
      exit_door: {
        name: 'Exit Door',
        description: 'A sturdy wooden door with an EXIT sign. The keypad displays a red locked light and 4 empty digit slots.\n\nCode: ____',
        actions: [
          { id: 'enter_code', label: 'Enter code on keypad' },
          { id: 'examine_keypad', label: 'Examine keypad' },
        ],
      },
    };

    return objectData[objectId];
  };

  const currentObject = getObjectData(selectedObject);
  const actions = currentObject
    ? currentObject.actions.map((action: any) => ({
        ...action,
        onPress: () => handleAction(action.id),
      }))
    : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>{experience?.name || 'Escape Room'}</Text>
          <Text style={styles.subHeaderText}>
            Tap objects to examine • Find clues • Escape!
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Message Banner */}
      {message && (
        <View style={styles.messageBanner}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      {/* Inventory */}
      {inventory.length > 0 && (
        <View style={styles.inventoryBar}>
          <Text style={styles.inventoryTitle}>Inventory:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {inventory.map((item) => (
              <View key={item.id} style={styles.inventoryItem}>
                <Text style={styles.inventoryItemText}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Room View */}
      <RoomView onObjectTap={handleObjectTap} />

      {/* Examination Modal */}
      <ExaminationModal
        visible={examinationModalVisible}
        onClose={handleCloseExaminationModal}
        objectId={selectedObject}
        objectName={currentObject?.name || ''}
        description={currentObject?.description || ''}
        actions={actions}
      />

      {/* Keypad Modal */}
      <KeypadModal
        visible={keypadModalVisible}
        onClose={() => setKeypadModalVisible(false)}
        onSubmit={handleCodeSubmit}
        codeLength={4}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  victoryContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  victoryTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 24,
    textAlign: 'center',
  },
  victoryText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  victorySubtext: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 40,
  },
  homeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6AB0F2',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  backButton: {
    width: 80,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    color: '#aaa',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  messageBanner: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  inventoryBar: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
  },
  inventoryTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  inventoryItem: {
    backgroundColor: '#4A90E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  inventoryItemText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

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
  console.log('[GameScreen] Component rendering START');

  const {
    experience,
    loading,
    inventory,
    gameWon,
    message,
    refreshKey,
    examineItem,
    openContainer,
    takeItem,
    useKey,
    enterCode,
  } = useGameState(experienceId);

  console.log(`[GameScreen] After useGameState, refreshKey=${refreshKey}`);

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
    if (!selectedObject || !experience) return;

    const currentRoom = experience.getCurrentRoom();
    if (!currentRoom) return;

    const item = currentRoom.findItem(selectedObject);
    if (!item) return;

    // Handle different actions
    switch (actionId) {
      case 'examine':
        const examineResult = examineItem(selectedObject);
        if (examineResult.success) {
          let msg = examineResult.description;

          // If there were triggered results (like ItemReward), show them
          if (examineResult.triggers && examineResult.triggers.length > 0) {
            examineResult.triggers.forEach((trigger: any) => {
              if (trigger.message) {
                msg += '\n\n' + trigger.message;
              }
              // Show rewards information
              if (trigger.rewards) {
                trigger.rewards.forEach((reward: any) => {
                  if (reward.type === 'InformationReward') {
                    msg += '\n\n' + reward.content;
                  }
                });
              }
            });
          }

          alert(msg);
          setExaminationModalVisible(false);
        }
        break;

      case 'open':
        const openResult = openContainer(selectedObject);
        if (openResult.success) {
          if (openResult.items && openResult.items.length > 0) {
            const itemNames = openResult.items.map(i => i.name).join(', ');
            alert(`You open the ${item.name} and find: ${itemNames}`);

            // Auto-take portable items
            openResult.items.forEach(i => {
              if (i.isPortable) {
                takeItem(i.id, selectedObject);
              }
            });
          } else {
            alert(`The ${item.name} is empty.`);
          }
          setExaminationModalVisible(false);
        } else {
          alert(openResult.message);
        }
        break;

      case 'take':
        const takeResult = takeItem(selectedObject);
        if (takeResult.success) {
          alert(`Took ${item.name}`);
          setExaminationModalVisible(false);
        } else {
          alert(takeResult.message);
        }
        break;

      case 'use_key':
        if (item.lockTriggerId) {
          const trigger = experience.getTrigger(item.lockTriggerId);
          if (trigger) {
            const triggerData = experience.triggers.get(item.lockTriggerId);
            const requiredKey = (triggerData as any).requiredKey;
            const hasKey = inventory.find(k => k.id === requiredKey);

            if (hasKey) {
              const keyResult = useKey(hasKey.id, item.lockTriggerId);
              alert(keyResult.message || (keyResult.success ? 'Unlocked!' : 'Failed to unlock'));
              if (keyResult.success) {
                setExaminationModalVisible(false);
              }
            }
          }
        }
        break;

      case 'enter_code':
        if (item.lockTriggerId) {
          setCurrentTriggerId(item.lockTriggerId);
          setKeypadModalVisible(true);
          setExaminationModalVisible(false);
        }
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

  // Get current object data dynamically from experience
  const getObjectData = (objectId: string | null) => {
    if (!objectId || !experience) return null;

    const currentRoom = experience.getCurrentRoom();
    if (!currentRoom) return null;

    const item = currentRoom.findItem(objectId);
    if (!item) return null;

    console.log('Found item:', item.toJSON());

    // Build actions based on item properties
    const actions: any[] = [];

    // Always allow examination
    if (item.isExaminable) {
      actions.push({ id: 'examine', label: 'Examine' });
    }

    // If it's a container, allow opening
    if (item.category === 'CONTAINER' && !item.isLocked) {
      actions.push({ id: 'open', label: 'Open' });
    }

    // If it's locked and has a trigger, show unlock option
    if (item.isLocked && item.lockTriggerId) {
      const trigger = experience.getTrigger(item.lockTriggerId);
      if (trigger) {
        // Check what type of trigger it is
        const triggerData = experience.triggers.get(item.lockTriggerId);
        if (triggerData?.type === 'KeypadLock') {
          actions.push({ id: 'enter_code', label: 'Enter code' });
        } else if (triggerData?.type === 'PadLock') {
          // Check if player has the required key
          const requiredKey = (triggerData as any).requiredKey;
          const hasKey = inventory.find(k => k.id === requiredKey);
          actions.push({
            id: 'use_key',
            label: hasKey ? `Use ${hasKey.name}` : 'Unlock (need key)',
            disabled: !hasKey
          });
        }
      }
    }

    // If portable, allow taking
    if (item.isPortable) {
      actions.push({ id: 'take', label: 'Take' });
    }

    console.log('Current object data:', {
      name: item.name,
      description: item.description,
      actionsCount: actions.length
    });

    return {
      name: item.name,
      description: item.description,
      actions
    };
  };

  const currentObject = getObjectData(selectedObject);
  const actions = currentObject
    ? currentObject.actions.map((action: any) => ({
        ...action,
        onPress: () => handleAction(action.id),
      }))
    : [];

  // Get current room items - create new array reference to force re-render
  // refreshKey changes when state updates, causing this to re-execute
  const currentRoom = experience?.getCurrentRoom();
  const roomItems = currentRoom ? [...currentRoom.items] : undefined;
  console.log(`[GameScreen] Rendering with ${roomItems?.length || 0} room items (refreshKey=${refreshKey})`);

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
      <RoomView
        onObjectTap={handleObjectTap}
        roomId={experience?.globalState.currentRoomId}
        items={roomItems}
      />

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

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import RoomView from '../components/RoomView';
import ExaminationModal from '../components/ExaminationModal';
import KeypadModal from '../components/KeypadModal';
import { useGameState } from '../hooks/useGameState';
import { playerProgressManager } from '../services/PlayerProgressManager';
import { stateManager } from '../services';
import { getRoomDisplayItems, getItemExaminationData, handleGenericAction } from '../utils/experienceHelpers';

interface DynamicGameScreenProps {
  experienceId: string;
  onExit: () => void;
}

export default function DynamicGameScreen({ experienceId, onExit }: DynamicGameScreenProps) {
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

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [examinationModalVisible, setExaminationModalVisible] = useState(false);
  const [keypadModalVisible, setKeypadModalVisible] = useState(false);
  const [currentTriggerId, setCurrentTriggerId] = useState<string | null>(null);
  const [codeLength, setCodeLength] = useState(4);

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
          You've escaped {experience?.name || 'the room'}!
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

  // Get current room
  const currentRoom = experience?.getCurrentRoom();
  console.log('[DynamicGameScreen] Current room:', currentRoom?.id, 'with', currentRoom?.items.length, 'items');

  if (!currentRoom) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: No room loaded</Text>
      </View>
    );
  }

  const handleObjectTap = (objectId: string) => {
    console.log('[handleObjectTap] Tapped object:', objectId);

    // IMPORTANT: Get the current room directly from experience, not from closure
    const room = experience?.getCurrentRoom();
    console.log('[handleObjectTap] Current room:', room?.id);
    console.log('[handleObjectTap] Room items:', room?.items.map(i => i.id).join(', '));

    if (!room) {
      Alert.alert('Error', 'No room loaded');
      return;
    }

    // Find the actual item
    const item = room.findItem(objectId);
    console.log('[handleObjectTap] Found item:', item?.id || 'NULL');

    if (!item) {
      Alert.alert('Error', `Could not find item: ${objectId}`);
      return;
    }

    setSelectedObjectId(objectId);
    setExaminationModalVisible(true);
  };

  const handleCloseExaminationModal = () => {
    setExaminationModalVisible(false);
    setSelectedObjectId(null);
  };

  const handleAction = (actionId: string, actionData?: any) => {
    if (!selectedObjectId) return;

    // IMPORTANT: Get the current room directly from experience, not from closure
    const room = experience?.getCurrentRoom();
    if (!room) return;

    console.log(`Action: ${actionId} on ${selectedObjectId}`);

    // Check if this is an unlock drawer action with a triggerId (keypad lock)
    if (actionId.startsWith('unlock_drawer_') && actionData?.triggerId) {
      const trigger = experience?.getTrigger(actionData.triggerId);
      if (trigger && (trigger as any).type === 'KeypadLock') {
        setCurrentTriggerId(actionData.triggerId);

        // Determine code length from trigger
        if ((trigger as any).codeLength) {
          setCodeLength((trigger as any).codeLength);
        }

        setKeypadModalVisible(true);
        setExaminationModalVisible(false);
        return;
      }
    }

    // Check if this is a container unlock action with a triggerId (keypad lock)
    if (actionId === 'unlock' && actionData?.triggerId) {
      const trigger = experience?.getTrigger(actionData.triggerId);
      if (trigger && (trigger as any).type === 'KeypadLock') {
        setCurrentTriggerId(actionData.triggerId);

        // Determine code length from trigger
        if ((trigger as any).codeLength) {
          setCodeLength((trigger as any).codeLength);
        }

        setKeypadModalVisible(true);
        setExaminationModalVisible(false);
        return;
      }
    }

    const stateCallbacks = {
      examineItem,
      openContainer,
      takeItem,
      useKey,
      enterCode: (triggerId: string, code: string) => enterCode(triggerId, code),
    };

    const result = handleGenericAction(
      actionId,
      selectedObjectId,
      room,
      stateCallbacks,
      inventory
    );

    switch (result.type) {
      case 'success':
        // Action succeeded, close modal without alert
        setExaminationModalVisible(false);
        break;

      case 'alert':
        if (result.message) {
          Alert.alert('', result.message);
        }
        break;

      case 'keypad':
        if (result.openKeypad && result.triggerId) {
          setCurrentTriggerId(result.triggerId);

          // Determine code length from trigger
          const trigger = experience?.getTrigger(result.triggerId);
          if (trigger && (trigger as any).codeLength) {
            setCodeLength((trigger as any).codeLength);
          }

          setKeypadModalVisible(true);
          setExaminationModalVisible(false);
        }
        break;

      case 'change_room':
        // Handle room navigation
        if ((result as any).roomId) {
          setExaminationModalVisible(false);
          const changeResult = stateManager.changeRoom((result as any).roomId);
          if (changeResult.success) {
            // Room change successful, state change event will trigger re-render
            if (result.message) {
              Alert.alert('', result.message);
            }
          } else {
            Alert.alert('Error', changeResult.message || 'Unable to change rooms');
          }
        }
        break;

      case 'error':
        if (result.message) {
          Alert.alert('Error', result.message);
        }
        break;
    }
  };

  const handleCodeSubmit = (code: string) => {
    setKeypadModalVisible(false);

    if (currentTriggerId) {
      const result = enterCode(currentTriggerId, code);
      if (result.success) {
        Alert.alert('Success!', result.message || 'Access granted!');
      } else {
        Alert.alert('Failed', result.message || `Incorrect code: ${code}`);
      }
    }

    setCurrentTriggerId(null);
  };

  // Get current object data
  // IMPORTANT: Get current room from experience to avoid closure issues
  const currentItem = selectedObjectId && currentRoom ? currentRoom.findItem(selectedObjectId) : null;
  const currentObjectData = currentItem ? getItemExaminationData(currentItem, inventory, experience || undefined) : null;

  // Debug logging
  if (currentObjectData) {
    console.log('Current object data:', {
      name: currentObjectData.name,
      description: currentObjectData.description,
      actionsCount: currentObjectData.actions?.length
    });
  }

  const actions = currentObjectData
    ? currentObjectData.actions.map((action: any) => ({
        ...action,
        onPress: () => handleAction(action.id, action),
      }))
    : [];

  // Get display items for the room (refreshKey will cause this to re-execute)
  const displayItems = getRoomDisplayItems(currentRoom);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onExit} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>{currentRoom.name}</Text>
          <Text style={styles.subHeaderText}>{experience?.name || 'Escape Room'}</Text>
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
              <TouchableOpacity
                key={item.id}
                style={styles.inventoryItem}
                onPress={() => {
                  // Show item details in alert
                  Alert.alert(item.name, item.description || 'No additional information available.');
                }}
              >
                <Text style={styles.inventoryItemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Room View - Visual representation */}
      <RoomView
        onObjectTap={handleObjectTap}
        roomId={currentRoom.id}
        items={displayItems}
      />

      {/* Examination Modal */}
      <ExaminationModal
        visible={examinationModalVisible}
        onClose={handleCloseExaminationModal}
        objectId={selectedObjectId}
        objectName={currentObjectData?.name || ''}
        description={currentObjectData?.description || ''}
        actions={actions}
      />

      {/* Keypad Modal */}
      <KeypadModal
        visible={keypadModalVisible}
        onClose={() => setKeypadModalVisible(false)}
        onSubmit={handleCodeSubmit}
        codeLength={codeLength}
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
  errorText: {
    color: '#FF5555',
    fontSize: 18,
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
    zIndex: 10, // Ensure header stays above RoomView
    elevation: 10, // Android shadow/elevation
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
    fontSize: 12,
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
    zIndex: 10, // Ensure inventory stays above RoomView
    elevation: 10, // Android shadow/elevation
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
  roomDescriptionContainer: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  roomDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  itemsList: {
    flex: 1,
    backgroundColor: '#000',
  },
  itemsListContent: {
    padding: 16,
  },
  itemsListTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemButton: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  itemButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  itemButtonArrow: {
    color: '#4A90E2',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

interface LetterLockModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  codeLength?: number;
}

// Five 4-letter words that can be made from these letters
// Words: WEST, EAST, BEST, REST, TEST
const DIAL_LETTERS = ['B', 'E', 'R', 'S', 'T', 'W'];

export default function LetterLockModal({
  visible,
  onClose,
  onSubmit,
  codeLength = 4,
}: LetterLockModalProps) {
  // Each dial starts at index 0
  const [dialPositions, setDialPositions] = useState<number[]>(Array(codeLength).fill(0));

  const spinDial = (dialIndex: number, direction: 'up' | 'down') => {
    setDialPositions(prev => {
      const newPositions = [...prev];
      if (direction === 'up') {
        newPositions[dialIndex] = (newPositions[dialIndex] + 1) % DIAL_LETTERS.length;
      } else {
        newPositions[dialIndex] = (newPositions[dialIndex] - 1 + DIAL_LETTERS.length) % DIAL_LETTERS.length;
      }
      return newPositions;
    });
  };

  const handleSubmit = () => {
    const code = dialPositions.map(pos => DIAL_LETTERS[pos]).join('');
    onSubmit(code);
    setDialPositions(Array(codeLength).fill(0));
  };

  const handleClose = () => {
    setDialPositions(Array(codeLength).fill(0));
    onClose();
  };

  const getCurrentCode = () => {
    return dialPositions.map(pos => DIAL_LETTERS[pos]).join('');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <SafeAreaView style={styles.modalOverlayInner}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Letter Lock</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Instructions */}
              <View style={styles.instructions}>
                <Text style={styles.instructionsText}>Spin the dials to spell a word</Text>
              </View>

              {/* Dials Container */}
              <View style={styles.dialsContainer}>
                {dialPositions.map((position, index) => {
                  const prevIndex = (position - 1 + DIAL_LETTERS.length) % DIAL_LETTERS.length;
                  const nextIndex = (position + 1) % DIAL_LETTERS.length;

                  return (
                    <View key={index} style={styles.dialColumn}>
                      {/* Up Arrow */}
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => spinDial(index, 'up')}
                      >
                        <Text style={styles.arrowText}>▲</Text>
                      </TouchableOpacity>

                      {/* Dial Window showing 3 letters */}
                      <View style={styles.dialWindow}>
                        {/* Previous letter (dimmed) */}
                        <View style={styles.dialLetterContainer}>
                          <Text style={[styles.dialLetter, styles.dialLetterDimmed]}>
                            {DIAL_LETTERS[prevIndex]}
                          </Text>
                        </View>

                        {/* Current letter (highlighted) */}
                        <View style={[styles.dialLetterContainer, styles.dialLetterCurrent]}>
                          <Text style={styles.dialLetter}>
                            {DIAL_LETTERS[position]}
                          </Text>
                        </View>

                        {/* Next letter (dimmed) */}
                        <View style={styles.dialLetterContainer}>
                          <Text style={[styles.dialLetter, styles.dialLetterDimmed]}>
                            {DIAL_LETTERS[nextIndex]}
                          </Text>
                        </View>
                      </View>

                      {/* Down Arrow */}
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={() => spinDial(index, 'down')}
                      >
                        <Text style={styles.arrowText}>▼</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {/* Current code display */}
              <View style={styles.codeDisplay}>
                <Text style={styles.codeText}>{getCurrentCode()}</Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>TRY CODE</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalOverlayInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#8B6F47',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 2,
    borderBottomColor: '#8B6F47',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  instructions: {
    padding: 16,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  dialsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  dialColumn: {
    alignItems: 'center',
    gap: 8,
  },
  arrowButton: {
    width: 60,
    height: 40,
    backgroundColor: '#5A4A3A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B6F47',
  },
  arrowText: {
    fontSize: 24,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  dialWindow: {
    width: 70,
    height: 180,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#8B6F47',
    overflow: 'hidden',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  dialLetterContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialLetterCurrent: {
    backgroundColor: '#3A3A3A',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dialLetter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D4AF37',
    fontFamily: 'monospace',
  },
  dialLetterDimmed: {
    opacity: 0.3,
    fontSize: 28,
  },
  codeDisplay: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444444',
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 8,
    fontFamily: 'monospace',
  },
  submitButton: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 16,
    backgroundColor: '#8B6F47',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A0826D',
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

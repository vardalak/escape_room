import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

interface KeypadModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  codeLength?: number;
}

export default function KeypadModal({
  visible,
  onClose,
  onSubmit,
  codeLength = 4,
}: KeypadModalProps) {
  const [code, setCode] = useState('');

  const handleNumberPress = (num: string) => {
    if (code.length < codeLength) {
      setCode(code + num);
    }
  };

  const handleBackspace = () => {
    setCode(code.slice(0, -1));
  };

  const handleClear = () => {
    setCode('');
  };

  const handleSubmit = () => {
    if (code.length === codeLength) {
      onSubmit(code);
      setCode('');
    }
  };

  const handleClose = () => {
    setCode('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Enter Code</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Display */}
          <View style={styles.display}>
            <View style={styles.displayInner}>
              {Array.from({ length: codeLength }).map((_, i) => (
                <View key={i} style={styles.digitBox}>
                  <Text style={styles.digitText}>{code[i] || '_'}</Text>
                </View>
              ))}
            </View>
            {code.length > 0 && (
              <Text style={styles.displayCount}>
                {code.length} / {codeLength}
              </Text>
            )}
          </View>

          {/* Keypad */}
          <View style={styles.keypad}>
            {/* Row 1 */}
            <View style={styles.keypadRow}>
              {['1', '2', '3'].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(num)}
                >
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View style={styles.keypadRow}>
              {['4', '5', '6'].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(num)}
                >
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 3 */}
            <View style={styles.keypadRow}>
              {['7', '8', '9'].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(num)}
                >
                  <Text style={styles.keypadButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 4 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity
                style={[styles.keypadButton, styles.specialButton]}
                onPress={handleClear}
              >
                <Text style={styles.keypadButtonText}>CLR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.keypadButton}
                onPress={() => handleNumberPress('0')}
              >
                <Text style={styles.keypadButtonText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.keypadButton, styles.specialButton]}
                onPress={handleBackspace}
              >
                <Text style={styles.keypadButtonText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              code.length !== codeLength && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={code.length !== codeLength}
          >
            <Text style={styles.submitButtonText}>ENTER</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#4A90E2',
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
    borderBottomColor: '#4A90E2',
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
  display: {
    padding: 24,
    alignItems: 'center',
  },
  displayInner: {
    flexDirection: 'row',
    gap: 12,
  },
  digitBox: {
    width: 50,
    height: 60,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FF00',
    fontFamily: 'monospace',
  },
  displayCount: {
    marginTop: 8,
    fontSize: 12,
    color: '#888888',
  },
  keypad: {
    padding: 16,
    gap: 12,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  keypadButton: {
    width: 70,
    height: 70,
    backgroundColor: '#34495E',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  specialButton: {
    backgroundColor: '#3A3A3A',
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  submitButton: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6CD470',
  },
  submitButtonDisabled: {
    backgroundColor: '#3A3A3A',
    borderColor: '#555555',
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

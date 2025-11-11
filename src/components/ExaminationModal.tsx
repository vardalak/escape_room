import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

interface Action {
  id: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

interface ExaminationModalProps {
  visible: boolean;
  onClose: () => void;
  objectId: string | null;
  objectName: string;
  description: string;
  actions?: Action[];
}

export default function ExaminationModal({
  visible,
  onClose,
  objectId,
  objectName,
  description,
  actions = [],
}: ExaminationModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{objectName}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.description}>{description}</Text>

            {/* Actions */}
            {actions.length > 0 && (
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsHeader}>Available Actions:</Text>
                {actions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.actionButton,
                      action.disabled && styles.actionButtonDisabled,
                    ]}
                    onPress={action.onPress}
                    disabled={action.disabled}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        action.disabled && styles.actionButtonTextDisabled,
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer hint */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Tap outside or X to close</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    borderWidth: 2,
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
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666666',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E0E0E0',
    marginBottom: 20,
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6AB0F2',
  },
  actionButtonDisabled: {
    backgroundColor: '#3A3A3A',
    borderColor: '#555555',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionButtonTextDisabled: {
    color: '#888888',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3A',
  },
  footerText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

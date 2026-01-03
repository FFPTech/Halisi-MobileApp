import React from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

interface AppModalProps {
  visible: boolean
  onClose?: () => void
  children: React.ReactNode
  title?: string
  animationType?: 'slide' | 'fade' | 'none'
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  children,
  title,
  animationType = 'fade',
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {title && <Text style={styles.title}>{title}</Text>}

              {children}

              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },

  closeText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
})

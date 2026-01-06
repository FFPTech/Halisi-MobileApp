import React from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

interface AppModalProps {
  visible: boolean

  children: React.ReactNode
  title?: string
  animationType?: 'slide' | 'fade' | 'none'
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,

  children,
  title,
  animationType = 'fade',
}) => {
  return (
    <Modal transparent visible={visible} animationType={animationType}>
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {title && <Text style={styles.title}>{title}</Text>}

              {children}
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

import React, {FC, ReactNode} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';

interface ModalComponentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  buttonText: string;
  isCustome?: boolean;
}

const ModalComponent: FC<ModalComponentProps> = ({
  isOpen,
  onRequestClose,
  children,
  buttonText = 'Fermer',
  isCustome = false,
}) => {
  return (
    <Modal
      visible={isOpen}
      onRequestClose={onRequestClose}
      transparent
      animationType="fade">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children}
          {!isCustome && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onRequestClose}>
              <Text style={styles.closeButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.blue,
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ModalComponent;

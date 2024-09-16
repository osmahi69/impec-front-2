import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/colors';
import Icon from 'react-native-ionicons';

interface ModalUpdateAppProps {
  showPopupForce: boolean;
  showPopup: boolean;
  callbackModal?: (value: boolean) => void;
  handleUpdateApp: () => void;
}

const ModalUpdateApp: React.FC<ModalUpdateAppProps> = ({
  showPopupForce,
  showPopup,
  callbackModal,
  handleUpdateApp,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <View>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => {
          console.log('close modal');
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {showPopup && (
              <View
                style={[
                  {
                    alignItems: 'flex-end',
                    position: 'absolute',
                    right: 15,
                    top: '5%',
                    // top: 60,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    callbackModal(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#FFFFFF',
                    // padding: 3,
                    borderRadius: 37,
                  }}>
                  <Icon name={'close'} size={30} color={colors.black} />
                </TouchableOpacity>
              </View>
            )}
            <View>
              <Text style={styles.label}>Mise à jour</Text>
              <Text style={styles.subtitle}>
                Une nouvelle version de l'application est disponible
              </Text>
              <TouchableOpacity
                onPress={() => handleUpdateApp()}
                activeOpacity={0.8}
                style={styles.button}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  Mettre à jour
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#000',
    alignSelf: 'center',
    fontSize: 24,
  },
  subtitle: {
    color: '#000',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: '10%',
  },
  button: {
    width: 200,
    height: 48,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 300,
    width: '80%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default ModalUpdateApp;

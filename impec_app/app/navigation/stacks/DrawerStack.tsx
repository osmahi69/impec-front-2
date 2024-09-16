// Importations
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React, {useContext, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-ionicons';

// Écrans
import {AlertDialog, Button, Center} from 'native-base';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {UserContext} from '../../contexte/authContext';
import AboutPage from '../../screens/About/About';
import Contact from '../../screens/Account/Contact';
import Profil from '../../screens/Account/Profil';
import {HomeScreenStack} from './HomeStack';
import {DateTime} from 'luxon';
import {colors} from '../../theme/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getVersion, unsubscribe} from '../../services/toolsAPI';
import {Alert} from 'react-native';
import ReactNativeVersionInfo from 'react-native-version-info';

// Création du Drawer Navigator
const Drawer = createDrawerNavigator();

const Logout = props => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isFocused = useIsFocused();
  const {logout} = useContext(UserContext);
  useEffect(() => {
    setIsOpen(true);
  }, [isFocused]);

  const onClose = () => {
    props?.setShowLogout(false);
    setIsOpen(false);
  };
  const cancelRef = React.useRef(null);

  const AlertDelelete = () => (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Information</AlertDialog.Header>
          <AlertDialog.Body>Se deconnecter</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                Fermer
              </Button>
              <Button colorScheme="danger" onPress={() => logout()}>
                Se deconnecter
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );

  return <AlertDelelete />;
};

const CustomDrawerContent = props => {
  //const {clientInfo} = props.route.params || {};

  const {userInfos} = React.useContext(UserContext);
  const [showLogout, setShowLogout] = useState(false);
  const [showBtnDesabonne, setShowBtnDesabonne] = useState(false);

  const handleUnsubscribe = () => {
    const emailAddress = 'loicbatonnet.dev@gmail.com';
    const subject = "Demande de résiliation d'abonnement";
    const body =
      'Bonjour,\n\nJe souhaiterais résilier mon abonnement. Veuillez procéder à la résiliation de mon abonnement.\n\nCordialement,';
    Linking.openURL(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
  };

  useEffect(() => {
    const load = async () => {
      const res = await getVersion(undefined);
      setShowBtnDesabonne(res?.showDesabonneBtn);
    };
    load();
  }, []);

  const handleDeleteAccount = () => {
    // Demander confirmation à l'utilisateur
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer votre compte ?',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Annulation de la suppression du compte'),
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: () => {
            // Afficher un message de confirmation
            Alert.alert(
              'Demande prise en compte',
              'Votre demande de suppression de compte sera traitée dans les plus brefs délais.',
            );
          },
        },
      ],
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Affichez les informations du client */}
      <View style={{marginLeft: 20}}>
        <Text style={{fontSize: 24, fontWeight: '600'}}>Bonjour 👋</Text>
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: 16}}>
            {userInfos?.userdetails?.profile?.nom}
            <Text style={{fontSize: 16}}>
              {' '}
              {userInfos?.userdetails?.profile?.prenom}
            </Text>
          </Text>

          <Text style={{fontSize: 16}}>
            {userInfos?.userdetails?.profile?.raison_social}
          </Text>
        </View>
      </View>

      <DrawerItemList {...props} />

      <View style={{marginLeft: 15}}>
        {showBtnDesabonne && (
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => handleUnsubscribe()}>
            <Text>Se désabonner</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[{marginTop: !showBtnDesabonne ? 20 : 35}]}
          onPress={() => setShowLogout(true)}>
          <Text>Déconnecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={[{marginTop: 35}]}>
          <Text style={{color: colors.icon}}>Supprimer mon compte</Text>
        </TouchableOpacity>

        {showLogout && <Logout setShowLogout={() => setShowLogout(false)} />}
        <Text style={{fontSize: 16, marginTop: 40, color: colors.primary}}>
          Version {ReactNativeVersionInfo.appVersion}
        </Text>
      </View>

      {/* <DrawerItem
        label="Accueil"
        onPress={() => {
          // Naviguez vers l'écran de profil du client
          props.navigation.navigate('HomeScreenStack');
        }}
      /> */}
    </DrawerContentScrollView>
  );
};

// DrawerStack
const currentDateTime = DateTime.local();
const formattedDate = currentDateTime
  .toFormat('EEEE d MMMM y HH:mm')
  .toLocaleString();

const backgroundImageUri =
  'https://images.pexels.com/photos/11911890/pexels-photo-11911890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const DrawerStack = () => {
  const insets = useSafeAreaInsets();
  const handleDrawerPress = (navigation: any) => {
    // Ouvrir le tiroir de navigation
    navigation.openDrawer();
  };

  const handleGoHome = (navigation: any) => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Accueil'}],
    });
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'front',
        header: ({navigation}) => (
          <View
            style={{
              paddingVertical: 10,
              //marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginTop: insets.top,
              //marginTop:10,
              backgroundColor: '#59a0bd',
            }}>
            <TouchableOpacity onPress={() => handleDrawerPress(navigation)}>
              <Icon name={'menu'} color={colors.primary} />
            </TouchableOpacity>
            <ImageBackground
              source={{uri: backgroundImageUri}}
              style={styles.backgroundImage}>
              <View style={styles.overlay}>
                <Text style={styles.dateTimeText}>
                  {/* {currentDateTime.day}{' '}
                    {currentDateTime.toLocaleString({
                      month: 'long',
                      locale: 'fr',
                    })}{' '}
                    {currentDateTime.toFormat('yyyy')}
                    {' · '} */}
                  <Text style={[styles.dateTimeText, {marginLeft: 20}]}>
                    {/* {currentDateTime.toFormat('HH:mm')} */}
                    {formattedDate}
                  </Text>
                </Text>
              </View>
            </ImageBackground>
            <TouchableOpacity onPress={() => handleGoHome(navigation)}>
              <Icon name={'home'} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ),
      }}
      useLegacyImplementation={false}>
      <Drawer.Screen name="Accueil" component={HomeScreenStack} />
      <Drawer.Screen name="Mon compte" component={Profil} />
      {/*  <Drawer.Screen name="Paramètres" component={HomeScreenStack} /> */}
      <Drawer.Screen name="Nous contacter" component={Contact} />
      <Drawer.Screen name="À propos" component={AboutPage} />
      {/*  <Drawer.Screen name="Déconnexion" component={Logout} /> */}
    </Drawer.Navigator>
  );
};

export default DrawerStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    aspectRatio: 1.5, // Pour s'assurer que les éléments soient carrés
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  backgroundImage: {
    //flex: 1,
    resizeMode: 'cover',
    height: 45,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

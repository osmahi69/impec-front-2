import React, {createContext, ReactNode, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode, {JwtPayload} from 'jwt-decode';
import {useApi} from '../hook/useApi';
import {IUsers} from '../types/UserTypes';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

interface UserContextValue {
  user: IUsers | null;
  login: (data: IUsers) => Promise<void>;
  logout: () => Promise<void>;
  isConnected: boolean;
  userInfos?: IUsers;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isConnected: false,
});

const UserProvider: React.FC = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState(null);
  //const [isLoading, setIsLoading] = useState(true);
  /* const [isConnected, setIsConnected] = useState(false); */
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userInfos, setUserInfos] = useState(undefined);
  const [token, setToken] = useState(null);
  const {API} = useApi();

  const savePushDevice = async fcm => {
    try {
      const deviceData = {
        platform: Platform.OS,
        deviceId: DeviceInfo.getUniqueId(), // Identifiant unique de l'appareil
        brand: DeviceInfo.getBrand(), // Marque de l'appareil
        model: DeviceInfo.getModel(), // Modèle de l'appareil
        systemName: DeviceInfo.getSystemName(), // Nom du système d'exploitation
        systemVersion: DeviceInfo.getSystemVersion(), // Version du système d'exploitation
        appVersion: DeviceInfo.getVersion(), // Version de l'application
        isEmulator: DeviceInfo.isEmulator(), // Indique si l'appareil est un émulateur
        isTablet: DeviceInfo.isTablet(), // Indique si l'appareil est une tablette
        token: fcm,
      };

      const response = await API.saveDevice(deviceData);
      if (response && response.status === 200 && response.data) {
        const jsonResp = response.data;
        if (jsonResp) {
          if (jsonResp.response) {
            return jsonResp;
          } else {
            if (jsonResp.msg) {
              return {response: false, msg: jsonResp.msg};
            } else {
              return {response: false, msg: "Une erreur s'est produite"};
            }
          }
        } else {
          return {response: false, msg: 'Veuillez vérifier votre connexion'};
        }
      } else {
        return {
          response: false,
          msg: 'Impossible de récupérer la configuration',
        };
      }
    } catch (error) {
      console.log('Error SAVE DEVICE ::: ' + error.toString());
      return {response: false, msg: 'Vérifiez votre connexion internet'};
    }
  };

  const getFcmToken = async () => {
    const firebaseToken = await messaging().getToken();
    if (firebaseToken) {
      console.log('firebaseToken', firebaseToken);
      savePushDevice(firebaseToken);
    }
  };
  const requestUserPermission = async () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    const authorizationStatus =
      Platform.OS === 'ios' ? await messaging().requestPermission() : true;

    if (authorizationStatus) {
      await messaging().registerDeviceForRemoteMessages();
      await getFcmToken();
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, [token]);

  const login = async (user: IUsers) => {
    if (user) {
      try {
        const userInfos = await AsyncStorage.setItem(
          'userInfos',
          JSON.stringify(user),
        );

        setUserInfos(user);
        setIsConnected(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userInfos');
      setIsConnected(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfUserConnected();
  }, []);

  const checkIfUserConnected = async () => {
    const u = await AsyncStorage.getItem('userInfos');
    const userInfos = JSON.parse(u);

    if (userInfos?.token) {
      setToken(userInfos?.token);
      setUserInfos(userInfos);
      setIsConnected(true);
    }
  };

  /*  const readUser = async () => {
    try {
      const result = await API.readUser();
      if (result.data) {
        setUser(result.data);
      }
    } catch (error) {
      console.log(' *** Error read user connected ***', error);
    }
  }; */

  const userContextValue: UserContextValue = {
    user,
    isConnected,
    userInfos,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

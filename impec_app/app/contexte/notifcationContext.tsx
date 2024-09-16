import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';
import axios from 'axios';
import {useApi} from '../hook/useApi';
import {UserContext} from './authContext';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var ringing = new Sound('ringing.mp3', Sound.MAIN_BUNDLE);
var blinking_bell_loop = new Sound('blinking_bell_loop.mp3', Sound.MAIN_BUNDLE);
var bright_ringtone = new Sound('bright_ringtone.mp3', Sound.MAIN_BUNDLE);
var cell_phone_ringing = new Sound('cell_phone_ringing.mp3', Sound.MAIN_BUNDLE);
var clock_alar = new Sound('clock_alar.mp3', Sound.MAIN_BUNDLE);
var ringtone = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE);

const PushNotificationContext = createContext();

export const usePushNotification = () => {
  return useContext(PushNotificationContext);
};

export const PushNotificationProvider = ({children}) => {
  const {API} = useApi();
  const [songState, setSongState] = useState(ringing);

  useEffect(() => {
    songState.setVolume(1);
    return () => {
      songState.release();
    };
  }, []);

  const play = () => {
    songState.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  };

  const showNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    const channelId = await notifee.createChannel({
      id: 'channel_starter',
      name: 'channel_starter',
      vibration: true,
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
    if (remoteMessage?.data?.proposerA === 'TAXI_VSL') {
      ringing.play();
    } else if (remoteMessage?.data?.proposerA === 'AMBULANCE') {
      blinking_bell_loop.play();
    } else if (remoteMessage?.data?.proposerA === 'TPMR') {
      bright_ringtone.play();
    } else if (remoteMessage?.data?.proposerA === 'BREAK') {
      clock_alar.play();
    } else if (remoteMessage?.data?.proposerA === 'MONOSPACE') {
      ringtone.play();
    } else if (remoteMessage?.data?.proposerA === 'BERLINE') {
      cell_phone_ringing.play();
    } else if (remoteMessage?.data?.proposerA === 'VAN') {
      cell_phone_ringing.play();
    }

    await notifee.displayNotification({
      android: {
        channelId: channelId,
        color: '#FFFFFF',
        style: {
          text: remoteMessage.notification.body,
          type: AndroidStyle.BIGTEXT,
        },
      },
      body: remoteMessage.notification.body,
      title: remoteMessage.notification.title,
      data: remoteMessage.data,
    });
  };

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message reçu en arrière-plan :', remoteMessage);

      showNotification(remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);
  const value = {
    // Fonctions pour gérer les notifications (envoyer, supprimer, etc.)
    // Vous pouvez les ajouter ici
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Linking, Platform, View} from 'react-native';
import {UserContext} from '../../contexte/authContext';
import {AuthScreenStack} from './AuthStack';
import {MainStackApp} from './MainStack';
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';
import VersionInfo from 'react-native-version-info';
import {useApi} from '../../hook/useApi';
import {getVersion} from '../../services/toolsAPI';
import ModalUpdateApp from '../../components/modalUpdateVersion';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');

export type MainStackParams = {
  Signin: {
    username: string;
    password: string;
  };
  Home: {
    username: string;
    password: string;
  };
  Appointement: {
    service: string;
  };
};

const MainStack = createNativeStackNavigator<MainStackParams>();

export const AppStack = () => {
  const {isConnected} = React.useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const {API} = useApi();

  /* var ringing = new Sound('ringing.mp3', Sound.MAIN_BUNDLE);
  var blinking_bell_loop = new Sound(
    'blinking_bell_loop.mp3',
    Sound.MAIN_BUNDLE,
  ); */
  /*  var bright_ringtone = new Sound('bright_ringtone.mp3', Sound.MAIN_BUNDLE);
  var cell_phone_ringing = new Sound(
    'cell_phone_ringing.mp3',
    Sound.MAIN_BUNDLE,
  );
  var clock_alar = new Sound('clock_alar.mp3', Sound.MAIN_BUNDLE);
  var ringtone = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE); */

  const audios = [
    {
      title: 'ringing',
      url: 'ringing.mp3',
      basePath: Sound.MAIN_BUNDLE,
    },
    {
      title: 'blinking_bell_loop',
      url: 'blinking_bell_loop.mp3',
      basePath: Sound.MAIN_BUNDLE,
    },
    {
      title: 'bright_ringtone',
      url: 'bright_ringtone.mp3',
      basePath: Sound.MAIN_BUNDLE,
    },
    {
      title: 'cell_phone_ringing',
      url: 'cell_phone_ringing.mp3',
      basePath: Sound.MAIN_BUNDLE,
    },
    {
      title: 'clock_alar',
      url: 'clock_alar.mp3',
      basePath: Sound.MAIN_BUNDLE,
    },
    {
      title: 'ringtone',
      url: 'ringtone.mp3',
      basePath: Sound.MAIN_BUNDLE,
    },
  ];

  function playSound(info) {
    var song = new Sound(info?.url, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      song.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  }

  /* useEffect(() => {
    setTimeout(() => {
      playSound(audio[0]);

      setTimeout(() => {
        playSound(audio[1]);
      }, 10000);
    }, 10000);
  }, []); */

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

    if (remoteMessage?.data?.proposerA === 'TAXI_VSL') {
      playSound(audios[0]);
    } else if (remoteMessage?.data?.proposerA === 'AMBULANCE') {
      playSound(audios[1]);
    } else if (remoteMessage?.data?.proposerA === 'TPMR') {
      playSound(audios[3]);
    } else if (remoteMessage?.data?.proposerA === 'BREAK') {
      playSound(audios[4]);
    } else if (remoteMessage?.data?.proposerA === 'MONOSPACE') {
      playSound(audios[5]);
    } else if (remoteMessage?.data?.proposerA === 'BERLINE') {
      playSound(audios[3]);
    } else if (remoteMessage?.data?.proposerA === 'VAN') {
      playSound(audios[3]);
    }
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

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator></ActivityIndicator>
      </View>
    );
  }

  return (
    <MainStack.Navigator>
      {isConnected ? (
        <MainStack.Screen
          options={{
            headerShown: false,
          }}
          name="MainStack"
          component={MainStackApp}
        />
      ) : (
        <MainStack.Screen
          options={{
            headerShown: false,
          }}
          name="AuthScreenStack"
          component={AuthScreenStack}
        />
      )}
    </MainStack.Navigator>
  );
};

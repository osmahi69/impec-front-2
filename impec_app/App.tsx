import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import 'dayjs/locale/fr'; // importez la locale française
import {NativeBaseProvider, extendTheme} from 'native-base';
import * as React from 'react';
import {LocaleConfig} from 'react-native-calendars';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {QueryClient, QueryClientProvider} from 'react-query';
import UserProvider from './app/contexte/authContext';
import RequestContextProvider from './app/contexte/requestContext';
import {AppStack} from './app/navigation/stacks/AppStack';

import {Settings} from 'luxon';
import {PushNotificationProvider} from './app/contexte/notifcationContext';

// Définir la locale en français
Settings.defaultLocale = 'fr';

function App() {
  const queryClient = new QueryClient();

  LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
    monthNamesShort: [
      'Janv.',
      'Févr.',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juil.',
      'Août',
      'Sept.',
      'Oct.',
      'Nov.',
      'Déc.',
    ],
    dayNames: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui",
  };
  LocaleConfig.defaultLocale = 'fr';

  const newColorTheme = {
    brand: {
      900: '#8287af',
      800: '#7c83db',
      700: '#b3bef6',
    },
    text: {
      900: '#000',
    },
  };

  const theme = extendTheme({colors: newColorTheme});

  return (
    <NavigationContainer>
      {/* <PushNotificationProvider> */}
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <NativeBaseProvider>
            <RequestContextProvider>
              <NativeBaseProvider theme={theme}>
                <UserProvider>
                  <QueryClientProvider client={queryClient}>
                    {/*  <AuthScreenStack /> */}
                    <AppStack />
                  </QueryClientProvider>
                </UserProvider>
              </NativeBaseProvider>
            </RequestContextProvider>
          </NativeBaseProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      {/* </PushNotificationProvider> */}
    </NavigationContainer>
  );
}

export default App;

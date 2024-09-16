import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SearchAddress} from '../../components/SearchAddress';
import TabStack from './TabStack';
import DrawerStack from './DrawerStack';
import {useApi} from '../../hook/useApi';

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

export const MainStackApp = () => {
  const {API} = useApi();

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        options={{
          headerShown: false,
        }}
        name="Drawer"
        component={DrawerStack}
      />
      {/*  <MainStack.Screen
        options={{
          headerShown: false,
        }}
        name="TabStack"
        component={TabStack}
      /> */}
    </MainStack.Navigator>
  );
};

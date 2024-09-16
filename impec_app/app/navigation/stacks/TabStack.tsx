import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {HomeScreenStack} from './HomeStack';
import {AuthScreenStack} from './AuthStack';
import {Image} from 'react-native';
import {colors} from '../../theme/colors';
import {AccountStackScreens} from './AccountStack';
import {SearchScreenStack} from './SearchStack';

const Tab = createBottomTabNavigator();

export default TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let path;
          if (route.name === 'Home') {
            path = require('../../assets/icons/home.png');
          } else if (route.name === 'Search') {
            path = require('../../assets/icons/search.png');
          } else if (route.name === 'Favourite') {
            path = require('../../assets/icons/heart_outline.png');
          } else if (route.name === 'AccountStackScreens') {
            path = require('../../assets/icons/account.png');
          }
          return (
            <Image
              style={[{tintColor: !focused ? colors.placeholder : colors.main}]}
              source={path}
            />
          );
        },
      })}
      tabBarOptions={{
        style: {
          backgroundColor: colors.main,
          borderTopWidth: 1,
          borderTopColor: colors.main,
        },
        activeTintColor: '#FFF',
        inactiveTintColor: '#fff',
      }}>
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={HomeScreenStack}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Search"
        component={SearchScreenStack}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Favourite"
        component={HomeScreenStack}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="AccountStackScreens"
        component={AccountStackScreens}
      />
    </Tab.Navigator>
  );
};

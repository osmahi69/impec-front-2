import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SearchAddress} from '../../components/SearchAddress';
import AddCourseForm from '../../screens/Agenda/AddCourseForm';
import AgendaScreen from '../../screens/Agenda/AgendaScreen';
import HomeScreen from '../../screens/Home/HomeScreen';
import PaymentMethod from '../../screens/PaymentMethod';
import ProposedRide from '../../screens/Ride/ProposedRide';
import {PeriodsTypes} from '../../types/PeriodsTypes';
import {UserTypes} from '../../types/UserTypes';
import ProposedRideTab from '../../screens/Ride/ProposedRideTab';
import WaitingRideTab from '../../screens/Ride/WaitingRideTab';
import WaitingRide from '../../screens/Ride/WaitingRide';
import AcceptedRideTab from '../../screens/Ride/AcceptedRideTab';
import AcceptedRide from '../../screens/Ride/AcceptedRide';
import DetailsRide from '../../screens/Ride/DetailsRide';
import DepositedCustomer from '../../screens/Ride/DepositedCustomer';
import ChatScreen from '../../screens/Home/Chat';
import Conversation from '../../screens/Home/Conversation';
import AgendaRide from '../../screens/Ride/AgendaRide';
import PaymentScreen from '../../screens/Payment/Payment';
import MyWebView from '../../components/WebView';

type HomeStackParamList = {
  Home: undefined;
  Details: undefined;
  AgendaScreen: undefined;
  OrderConfirmStep1: {period: PeriodsTypes; user: UserTypes};
  PaymentMethod: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeScreenStack = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Group>
        {/* <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="UploadTest"
          component={UploadTest}
        /> */}
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="Home"
          component={HomeScreen}
        />

        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="Conversation"
          component={Conversation}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="Chat"
          component={ChatScreen}
        />

        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="AddCourseForm"
          component={AddCourseForm}
        />

        <HomeStack.Screen
          name="AcceptedRideTab"
          options={{
            headerShown: false,
          }}
          component={AcceptedRideTab}
        />
        <HomeStack.Screen
          name="AgendaRide"
          options={{
            headerShown: false,
          }}
          component={AgendaRide}
        />
        <HomeStack.Screen
          name="AcceptedRide"
          options={{
            headerShown: false,
          }}
          component={AcceptedRide}
        />
        <HomeStack.Screen
          name="DetailsRide"
          options={{
            headerShown: false,
          }}
          component={DetailsRide}
        />

        <HomeStack.Screen
          name="ProposedRideTab"
          options={{
            headerShown: false,
          }}
          component={ProposedRideTab}
        />
        <HomeStack.Screen
          name="ProposedRide"
          options={{
            headerShown: false,
          }}
          component={ProposedRide}
        />
        <HomeStack.Screen
          name="WaitingRideTab"
          options={{
            headerShown: false,
          }}
          component={WaitingRideTab}
        />
        <HomeStack.Screen
          name="WaitingRide"
          options={{
            headerShown: false,
          }}
          component={WaitingRide}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="AgendaScreen"
          component={AgendaScreen}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="PaymentScreen"
          component={PaymentScreen}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="SearchAddress"
          component={SearchAddress}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="webview"
          component={MyWebView}
        />
        <HomeStack.Screen
          options={{
            headerShown: false,
          }}
          name="DepositedCustomer"
          component={DepositedCustomer}
        />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
};

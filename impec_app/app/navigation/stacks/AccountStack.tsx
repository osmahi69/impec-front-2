import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Appointement from '../../screens/Appointment/Appointment';
import ForgotPassword from '../../screens/Auth/SignIn';
import Login from '../../screens/Auth/Login';
import SignUp from '../../screens/Auth/SignUp';
import PaymentScreen from '../../screens/Payment/Payment';
import MyWebView from '../../components/WebView';
import Account from '../../screens/Account/Account';

export type AccountStackParams = {
  Login: {
    username: string;
    password: string;
  };
};

const AccountStack = createNativeStackNavigator<AccountStackParams>();

export const AccountStackScreens = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Group>
        {/*  <AccountStack.Screen
          options={{
            headerShown: false,
          }}
          name="PaymentScreen"
          component={PaymentScreen}
        />
        */}
        <AccountStack.Screen
          options={{
            headerShown: false,
          }}
          name="Account"
          component={Account}
        />
      </AccountStack.Group>
    </AccountStack.Navigator>
  );
};

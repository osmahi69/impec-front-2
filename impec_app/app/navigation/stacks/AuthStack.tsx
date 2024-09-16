import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Appointement from '../../screens/Appointment/Appointment';
import ForgotPassword from '../../screens/Auth/ForgotPassword';
import Login from '../../screens/Auth/Login';
import SignUp from '../../screens/Auth/SignUp';
import PaymentScreen from '../../screens/Payment/Payment';
import MyWebView from '../../components/WebView';
import Account from '../../screens/Account/Account';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {theme} from '../../theme/theme';
import {useNavigation} from '@react-navigation/native';
import AddEnseign from '../../screens/Auth/AddEnseign';
import {SearchAddress} from '../../components/SearchAddress';
import { colors } from '../../theme/colors';

export type AuthStackParams = {
  Login: {
    username: string;
    password: string;
  };
};

const AuthStack = createNativeStackNavigator<AuthStackParams>();

export const HeaderAuth = ({
  title,
  disableBack = false,
}: {
  title: string;
  disableBack?: boolean;
}) => {
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          marginTop: 30,

          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {!disableBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              height: 32,
              width: 32,
              position: 'absolute',
              left: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={require('../../assets/icons/left.png')} />
          </TouchableOpacity>
        )}
        <View style={{}}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: theme.fonts.bold,
              color: colors.black,
            }}>
            {title}
          </Text>
        </View>
      </View>
    </>
  );
};

export const AuthScreenStack = () => {
  return (
    <AuthStack.Navigator
    //initialRouteName="AddEnseign"
    >
      <AuthStack.Group>
        {/*  <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="PaymentScreen"
          component={PaymentScreen}
        />
        */}
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={Login}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="SignUp"
          component={SignUp}
        />

        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="AddEnseign"
          component={AddEnseign}
        />

        <AuthStack.Screen
          options={{
            headerShown: true,
          }}
          name="MyWebView"
          component={MyWebView}
        />

        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="SearchAddress"
          component={SearchAddress}
        />

        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="ForgotPassword"
          component={ForgotPassword}
        />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

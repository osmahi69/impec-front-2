import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
//import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useForm, Controller} from 'react-hook-form';
//import {Auth} from 'aws-amplify';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/customButton/CustomButton';
import FormInput from '../../components/customInput/FormInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStripe} from '@stripe/stripe-react-native';

const API_URL = 'http://127.0.0.1:8000';

const PaymentScreen = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_URL}/new-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const {paymentIntent, ephemeralKey, customer} = await response.json();
      console.log(' *** new intent ***', response.json());
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.log(' *** errer ***', error);
    }
  };

  const initializePaymentSheet = async () => {
    const result = await fetchPaymentSheetParams();
    console.log(' *** result ***', result);
    const {paymentIntent, ephemeralKey, customer, publishableKey} =
      await fetchPaymentSheetParams();
    const {error} = await initPaymentSheet({
      merchantDisplayName: 'O point de beauté',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    /*  if (!error) {
      setLoading(true);
    } */
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  const onSignInPressed = async data => {
    if (loading) {
      return;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 30, paddingLeft: 20}}>
          <Text style={{fontSize: 26, fontWeight: '800', color: '#000000'}}>
            Point de beauté
          </Text>
          <Text style={{fontSize: 14, color: '#000000'}}>
            Forfait épilation
          </Text>
        </View>
        <View style={styles.root}>
          <CustomButton
            text={loading ? 'Loading...' : 'Payer'}
            onPress={handleSubmit(openPaymentSheet)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default PaymentScreen;

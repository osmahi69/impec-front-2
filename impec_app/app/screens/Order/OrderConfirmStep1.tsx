import React, {FC, ReactElement} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {AppointmentTypes} from '../../navigation/stacks/HomeStack';
import {theme} from '../../theme/theme';
import dayjs from 'dayjs';
import {colors} from '../../theme/colors';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-ionicons';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
};
const OrderConfirmStep1: FC<ChildProps> = ({navigation}): ReactElement => {
  const route = useRoute<RouteProp<ParamListBase>>();
  const {periods, price, staff, service}: AppointmentTypes = route?.params;
  const insets = useSafeAreaInsets();

  const date = dayjs(periods?.date).locale('fr').format('DD MMMM');

  console.log(' *** appointment ***', JSON.stringify(route?.params, null, 2));

  const fees = 0.99;
  const totalPrice = Number(Number(price) + fees);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          height: 30,
          width: 30,
          left: 15,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
        }}>
        <Icon
          //size={28}
          ios="arrow-round-back"
          android="arrow-round-back"
          color="#000000"
        />
      </TouchableOpacity>
      <View
        style={{
          marginTop: 20,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontFamily: theme.fonts.bold, fontSize: 16}}>
            Récapitulatif de votre rendez-vous
          </Text>
          <View style={{marginVertical: 10}}>
            <Text style={{fontFamily: theme.fonts.regular, fontSize: 14}}>
              Votre choix : {service}
            </Text>
          </View>
          <Text style={{fontFamily: theme.fonts.semiBold, fontSize: 14}}>
            Le {date} à {periods?.hours}
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.semiBold,
              fontSize: 14,
              marginVertical: 12,
            }}>
            avec
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.semiBold,
              fontSize: 14,
              marginVertical: 12,
            }}>
            {`${staff?.firstname} ${staff?.lastname}`}
          </Text>
        </View>
        {/*  */}
        <View style={{marginHorizontal: 16}}>
          {/* sous total */}
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.infosPrice}>Sous-total </Text>
            <Text
              style={[styles.infosPrice, {fontFamily: theme.fonts.semiBold}]}>
              {price}€
            </Text>
          </View>
          {/* Frais */}
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={styles.infosPrice}>Frais de service </Text>
            <Text
              style={[styles.infosPrice, {fontFamily: theme.fonts.semiBold}]}>
              {fees}€
            </Text>
          </View>
          <View
            style={{
              height: 48,
              backgroundColor: colors.gray,
              borderRadius: 15,
              padding: 12,
              marginTop: 10,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 16, fontFamily: theme.fonts.bold}}>
                Total :
              </Text>
              <Text style={{fontSize: 16, fontFamily: theme.fonts.bold}}>
                {totalPrice}€
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{marginTop: 26, paddingHorizontal: 16}}>
        <ButtonComponent
          //disabled={!dateAppoitment || !periods?.hours}
          //onPress={() => handleSubmitAppointement(totalPrice)}
          container={{
            backgroundColor: colors.black,
            borderRadius: 10,
            padding: 8,
            height: 48,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Payer"
          textStyle={{
            color: colors.white,
            fontFamily: theme.fonts.semiBold,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

OrderConfirmStep1.propTypes = {};
OrderConfirmStep1.defaultProps = {};
export default OrderConfirmStep1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  infosPrice: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
  },
});

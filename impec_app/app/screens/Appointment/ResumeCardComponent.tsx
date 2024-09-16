import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import React, {FC, ReactElement, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import CustomButton from '../../components/customButton/CustomButton';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';
import dayjs from 'dayjs';
import {PeriodsTypes} from '../../types/PeriodsTypes';
import {Container, HStack, Switch} from 'native-base';
import {UserTypes} from '../../types/UserTypes';

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const PriceComponent = ({
  setShowAboutAccompte,
  value,
  price,
}: {
  value: boolean;
  setShowAboutAccompte: (value: boolean) => void;
  price: number;
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        <View
          style={{
            height: 48,
            backgroundColor: colors.gray,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}>
          <Text style={{fontSize: 22, fontFamily: theme.fonts.bold}}>
            {price}€
          </Text>
        </View>
        <View
          style={{
            height: 48,
            padding: 12,
            borderRadius: 15,
          }}>
          <HStack alignItems="center" space={4}>
            <Text style={{fontFamily: theme.fonts.semiBold}}>
              Payer l'accompte
            </Text>
            <Switch
              size="md"
              onTrackColor={colors.main}
              value={value}
              onToggle={val => setShowAboutAccompte(val)}
            />
          </HStack>
        </View>
      </View>
    </View>
  );
};

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  periods: PeriodsTypes;
  handleSubmitAppointement: (value: any) => void;
  staff: UserTypes;
};
const ResumeCardComponent: FC<ChildProps> = ({
  periods,
  handleSubmitAppointement,
  staff,
}): ReactElement => {
  const insets = useSafeAreaInsets();
  const [showAboutAccompte, setShowAboutAccompte] = useState<boolean>(false);

  const dateAppoitment =
    dayjs(periods?.date).locale('fr').format('DD MMMM') == 'Invalid Date'
      ? null
      : dayjs(periods?.date).locale('fr').format('DD MMMM YYYY');

  const totalPrice = useMemo(() => {
    let p: number = 25;
    if (showAboutAccompte) {
      p = (p * 0.5).toFixed(2);
    }
    return p;
  }, [showAboutAccompte]);

  return (
    <View style={{flex: 1, marginVertical: 20}}>
      <View
        style={[
          styles.shadow,
          {
            backgroundColor: colors.white,
            borderRadius: 10,
            paddingVertical: 20,
          },
        ]}>
        <View style={{alignItems: 'center', marginVertical: 10}}>
          <Text style={{fontFamily: theme.fonts.bold, fontSize: 16}}>
            Pose gel UV
          </Text>
          {staff ? (
            <Text
              style={{
                fontSize: 12,
                marginTop: 8,
                fontFamily: theme.fonts.regular,
              }}>
              👉 avec {`${staff?.firstname} ${staff?.lastname}`}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 12,
                marginTop: 8,
                marginHorizontal: 16,
                textAlign: 'center',
                fontFamily: theme.fonts.regular,
                color: colors.error,
              }}>
              Noubliez pas de choisir votre spécialiste
            </Text>
          )}
        </View>
        {/* Price */}
        <PriceComponent
          value={showAboutAccompte}
          price={totalPrice}
          setShowAboutAccompte={val => {
            setShowAboutAccompte(!showAboutAccompte);
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Image source={require('../../assets/icons/note.png')} />
              <Text style={{fontFamily: theme.fonts.regular}}>Date</Text>
            </View>

            <Text style={{fontFamily: theme.fonts.semiBold}}>
              {dateAppoitment || '-'}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#C6C6C650',
              width: 1,
              marginTop: 20,
              height: 40,
            }}
          />
          <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Image source={require('../../assets/icons/note.png')} />
              <Text style={{fontFamily: theme.fonts.regular}}>Heure</Text>
            </View>
            <Text style={{fontFamily: theme.fonts.semiBold}}>
              {periods?.hours || '-'}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 26, paddingHorizontal: 16}}>
          <ButtonComponent
            disabled={!dateAppoitment || !periods?.hours || !staff}
            onPress={() => handleSubmitAppointement(totalPrice)}
            container={{
              backgroundColor: colors.black,
              borderRadius: 10,
              padding: 8,
              height: 48,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Réserver"
            textStyle={{
              color: colors.white,
              fontFamily: theme.fonts.semiBold,
            }}
          />
          {showAboutAccompte && (
            <Text
              style={{
                fontSize: 10,
                fontFamily: theme.fonts.regular,
                marginTop: 5,
              }}>
              l'accompte correspond à 50% du prix total de{' '}
              <Text style={{fontFamily: theme.fonts.bold}}>{25}</Text>€
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

ResumeCardComponent.propTypes = {};
ResumeCardComponent.defaultProps = {};
export default ResumeCardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.46,
    elevation: 9,
  },
});

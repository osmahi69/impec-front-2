import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import React, {
  FC,
  Fragment,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import CustomButton from '../../components/customButton/CustomButton';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';
import {UserTypes} from '../../types/UserTypes';

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  handleSelectStaff: (value: UserTypes) => void;
};
const SpecialistComponent: FC<ChildProps> = ({
  handleSelectStaff,
}): ReactElement => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const minDate = new Date();
  const [dateSelected, setDateSelected] = useState<string[]>([]);

  const handleSelectSpecialist = () => {
    const fakeUser: UserTypes = {
      firstname: 'John',
      lastname: 'Doe',
      role: 3, // rôle non autorisé (devrait être 0 ou 1)
      nickname: 'johndoe123',
      password: 'password123',
      phone: 1234567890,
      address: '123 Fake St.',
      city: 'Faketown',
      zipcode: 97420,
      lat: '40.7128',
      lng: '-74.006',
      avatar: 'https://fakeurl.com/avatar.jpg',
      email: 'johndoe@gmail.com',
      stripe_id: null,
      etablissement_id: 2,
    };

    handleSelectStaff(fakeUser);
  };

  return useMemo(() => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}>
          {[0, 1, 2, 3, 4, 5].map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => handleSelectSpecialist(item, index)}
                style={[styles.specialistItem]}>
                <FastImage
                  style={{height: 90, width: 90, borderRadius: 20}}
                  source={{uri: LINK}}
                />
                <View style={{marginTop: 10}}>
                  <Text style={styles.firstname}>Jenny</Text>
                  <Text style={styles.poste}>Prothésite</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }, []);
};

SpecialistComponent.propTypes = {};
SpecialistComponent.defaultProps = {};
export default SpecialistComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  calendar: {
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
  },
  specialistItem: {
    padding: 10,
    borderRadius: 20,
    borderColor: colors.oarange,
    alignItems: 'center',
    width: 140,
    height: 160,
  },
  btnContinued: {
    height: 48,
    width: '90%',
    backgroundColor: colors.oarange,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstname: {
    fontSize: 16,
    color: colors.oarange,
    fontWeight: '600',
    textAlign: 'center',
  },
  poste: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '300',
  },
  hours: {
    padding: 10,
    borderRadius: 20,
    borderColor: colors.oarange,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

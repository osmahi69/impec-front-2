import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import React, {FC, ReactElement} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../theme/colors';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  description: string;
};

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const SCHEDULES = [
  {
    day: 'Lundi',
    morning: '09:00',
    afternoon: '18:00',
  },
  {
    day: 'Mardi',
    morning: '09:00',
    afternoon: '18:00',
  },
  ,
  {
    day: 'Mercredi',
    morning: '09:00',
    afternoon: '18:00',
  },
  ,
  {
    day: 'Jeudi',
    morning: '09:00',
    afternoon: '18:00',
  },
  ,
  {
    day: 'Vendredi',
    morning: '09:00',
    afternoon: '18:00',
  },
  ,
  {
    day: 'Samedi',
    morning: '09:00',
    afternoon: '18:00',
  },
  ,
  {
    day: 'Dimanche',
    morning: '09:00',
    afternoon: '18:00',
  },
  ,
];

const About: FC<ChildProps> = ({description}): ReactElement => {
  return (
    <View style={{marginTop: 20, flex: 1}}>
      <View style={{}}>
        <Text style={{fontSize: 14, fontWeight: '300', lineHeight: 22}}>
          {description}
        </Text>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 14, fontWeight: '800'}}>Horaires</Text>
      </View>
      <View style={{}}>
        {SCHEDULES.map(item => {
          return (
            <View style={{marginTop: 10, flexDirection: 'row'}}>
              <Text style={{fontSize: 14, fontWeight: '300'}}>{item?.day}</Text>
              <Text style={{fontSize: 14, marginLeft: 10, fontWeight: '500'}}>
                : {item?.morning} - {item?.afternoon}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

About.propTypes = {};
About.defaultProps = {};
export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  cover: {
    height: 280,
    width: '100%',
    borderBottomRightRadius: 20,
  },
  containerInfos: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  openText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  iconStyle: {tintColor: colors.oarange, width: 14, height: 14},
  openContainer: {
    backgroundColor: colors.oarange,
    padding: 8,
    borderRadius: 15,
  },
  separator: {
    height: 1,
    marginTop: 20,
    width: '90%',
    backgroundColor: colors.gray,
    alignSelf: 'center',
  },
  tempcard: {
    height: 90,
    backgroundColor: colors.oarange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});
